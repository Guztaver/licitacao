<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Item::query();

        // Search filter
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('unit_of_measurement', 'like', "%{$search}%");
            });
        }

        // Unit of measurement filter
        if ($request->filled('unit_of_measurement')) {
            $query->where(
                'unit_of_measurement',
                $request->input('unit_of_measurement'),
            );
        }

        // Price range filters
        if ($request->filled('min_price')) {
            $query->where('medium_price', '>=', $request->input('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('medium_price', '<=', $request->input('max_price'));
        }

        // Sorting
        $sortField = $request->input('sort', 'name');
        $sortDirection = $request->input('direction', 'asc');
        $query->orderBy($sortField, $sortDirection);

        $items = $query->paginate(15)->withQueryString();

        // Get unique units of measurement for filter
        $units = Item::select('unit_of_measurement')
            ->distinct()
            ->orderBy('unit_of_measurement')
            ->pluck('unit_of_measurement');

        // Calculate stats
        $stats = [
            'total_items' => Item::count(),
            'average_price' => Item::avg('medium_price'),
            'highest_price' => Item::max('medium_price'),
            'lowest_price' => Item::min('medium_price'),
        ];

        return Inertia::render('Items/Index', [
            'items' => $items,
            'units' => $units,
            'stats' => $stats,
            'filters' => [
                'search' => $request->input('search'),
                'unit_of_measurement' => $request->input('unit_of_measurement'),
                'min_price' => $request->input('min_price'),
                'max_price' => $request->input('max_price'),
                'sort' => $sortField,
                'direction' => $sortDirection,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Items/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:255', 'unique:items,code'],
            'name' => ['required', 'string', 'max:255'],
            'unit_of_measurement' => ['required', 'string', 'max:255'],
            'medium_price' => [
                'required',
                'numeric',
                'min:0',
                'max:99999999.99',
            ],
        ]);

        $item = Item::create($validated);

        return redirect()
            ->route('items.index')
            ->with('success', 'Item criado com sucesso!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Item $item): Response
    {
        return Inertia::render('Items/Show', [
            'item' => $item,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Item $item): Response
    {
        return Inertia::render('Items/Edit', [
            'item' => $item,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Item $item): RedirectResponse
    {
        $validated = $request->validate([
            'code' => [
                'required',
                'string',
                'max:255',
                Rule::unique('items')->ignore($item->id),
            ],
            'name' => ['required', 'string', 'max:255'],
            'unit_of_measurement' => ['required', 'string', 'max:255'],
            'medium_price' => [
                'required',
                'numeric',
                'min:0',
                'max:99999999.99',
            ],
        ]);

        $item->update($validated);

        return redirect()
            ->route('items.index')
            ->with('success', 'Item atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Item $item): RedirectResponse
    {
        $item->delete();

        return redirect()
            ->route('items.index')
            ->with('success', 'Item excluído com sucesso!');
    }

    /**
     * Import items from Excel file.
     */
    public function import(Request $request): RedirectResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:10240'],
        ]);

        try {
            $file = $request->file('file');
            $spreadsheet = IOFactory::load($file->getPathname());
            $worksheet = $spreadsheet->getActiveSheet();
            $rows = $worksheet->toArray();

            // Skip header row
            $header = array_shift($rows);

            $imported = 0;
            $updated = 0;
            $errors = [];

            foreach ($rows as $index => $row) {
                // Skip empty rows
                if (empty(array_filter($row))) {
                    continue;
                }

                $rowNumber = $index + 2; // +2 because we removed header and arrays are 0-indexed

                // Extract data from row
                $code = trim($row[0] ?? '');
                $name = trim($row[1] ?? '');
                $unit = trim($row[2] ?? '');
                $price = $row[3] ?? null;

                // Validate row data
                $validator = Validator::make(
                    [
                        'code' => $code,
                        'name' => $name,
                        'unit_of_measurement' => $unit,
                        'medium_price' => $price,
                    ],
                    [
                        'code' => ['required', 'string', 'max:255'],
                        'name' => ['required', 'string', 'max:255'],
                        'unit_of_measurement' => [
                            'required',
                            'string',
                            'max:255',
                        ],
                        'medium_price' => ['required', 'numeric', 'min:0'],
                    ],
                );

                if ($validator->fails()) {
                    $errors[] =
                        "Linha {$rowNumber}: ".
                        implode(', ', $validator->errors()->all());

                    continue;
                }

                // Update or create item
                $item = Item::where('code', $code)->first();

                if ($item) {
                    $item->update([
                        'name' => $name,
                        'unit_of_measurement' => $unit,
                        'medium_price' => $price,
                    ]);
                    $updated++;
                } else {
                    Item::create([
                        'code' => $code,
                        'name' => $name,
                        'unit_of_measurement' => $unit,
                        'medium_price' => $price,
                    ]);
                    $imported++;
                }
            }

            $message = "Importação concluída! {$imported} itens importados, {$updated} itens atualizados.";

            if (count($errors) > 0) {
                $message .= ' '.count($errors).' erros encontrados.';
            }

            return redirect()
                ->route('items.index')
                ->with('success', $message)
                ->with('import_errors', $errors);
        } catch (\Exception $e) {
            return redirect()
                ->route('items.index')
                ->with(
                    'error',
                    'Erro ao importar arquivo: '.$e->getMessage(),
                );
        }
    }

    /**
     * Export items to Excel.
     */
    public function export(Request $request): void
    {
        $query = Item::query();

        // Apply same filters as index
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('unit_of_measurement', 'like', "%{$search}%");
            });
        }

        if ($request->filled('unit_of_measurement')) {
            $query->where(
                'unit_of_measurement',
                $request->input('unit_of_measurement'),
            );
        }

        if ($request->filled('min_price')) {
            $query->where('medium_price', '>=', $request->input('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('medium_price', '<=', $request->input('max_price'));
        }

        $items = $query->orderBy('name')->get();

        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();

        // Set headers
        $sheet->setCellValue('A1', 'Código');
        $sheet->setCellValue('B1', 'Nome');
        $sheet->setCellValue('C1', 'Unidade de Medida');
        $sheet->setCellValue('D1', 'Preço Médio');

        // Style headers
        $sheet->getStyle('A1:D1')->getFont()->setBold(true);

        // Add data
        $row = 2;
        foreach ($items as $item) {
            $sheet->setCellValue('A'.$row, $item->code);
            $sheet->setCellValue('B'.$row, $item->name);
            $sheet->setCellValue('C'.$row, $item->unit_of_measurement);
            $sheet->setCellValue('D'.$row, $item->medium_price);
            $row++;
        }

        // Auto-size columns
        foreach (range('A', 'D') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $writer = new Xlsx($spreadsheet);
        $filename = 'items_'.date('Y-m-d_His').'.xlsx';

        header(
            'Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        header('Content-Disposition: attachment;filename="'.$filename.'"');
        header('Cache-Control: max-age=0');

        $writer->save('php://output');
        exit();
    }

    /**
     * Download Excel template for import.
     */
    public function downloadTemplate(): void
    {
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();

        // Set headers
        $sheet->setCellValue('A1', 'Código');
        $sheet->setCellValue('B1', 'Nome');
        $sheet->setCellValue('C1', 'Unidade de Medida');
        $sheet->setCellValue('D1', 'Preço Médio');

        // Style headers
        $sheet->getStyle('A1:D1')->getFont()->setBold(true);

        // Add example row
        $sheet->setCellValue('A2', 'ITEM001');
        $sheet->setCellValue('B2', 'Exemplo de Item');
        $sheet->setCellValue('C2', 'UN');
        $sheet->setCellValue('D2', '10.50');

        // Auto-size columns
        foreach (range('A', 'D') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $writer = new Xlsx($spreadsheet);
        $filename = 'template_items.xlsx';

        header(
            'Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        header('Content-Disposition: attachment;filename="'.$filename.'"');
        header('Cache-Control: max-age=0');

        $writer->save('php://output');
        exit();
    }
}
