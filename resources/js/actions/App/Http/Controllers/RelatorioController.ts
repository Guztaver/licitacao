import { queryParams, type RouteDefinition, type RouteFormDefinition, type RouteQueryOptions } from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\RelatorioController::exportRequisicoes
 * @see app/Http/Controllers/RelatorioController.php:284
 * @route '/relatorios/requisicoes/export'
 */
export const exportRequisicoes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportRequisicoes.url(options),
    method: 'get',
});

exportRequisicoes.definition = {
    methods: ['get', 'head'],
    url: '/relatorios/requisicoes/export',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\RelatorioController::exportRequisicoes
 * @see app/Http/Controllers/RelatorioController.php:284
 * @route '/relatorios/requisicoes/export'
 */
exportRequisicoes.url = (options?: RouteQueryOptions) => {
    return exportRequisicoes.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\RelatorioController::exportRequisicoes
 * @see app/Http/Controllers/RelatorioController.php:284
 * @route '/relatorios/requisicoes/export'
 */
exportRequisicoes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportRequisicoes.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RelatorioController::exportRequisicoes
 * @see app/Http/Controllers/RelatorioController.php:284
 * @route '/relatorios/requisicoes/export'
 */
exportRequisicoes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportRequisicoes.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\RelatorioController::exportRequisicoes
 * @see app/Http/Controllers/RelatorioController.php:284
 * @route '/relatorios/requisicoes/export'
 */
const exportRequisicoesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportRequisicoes.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RelatorioController::exportRequisicoes
 * @see app/Http/Controllers/RelatorioController.php:284
 * @route '/relatorios/requisicoes/export'
 */
exportRequisicoesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportRequisicoes.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RelatorioController::exportRequisicoes
 * @see app/Http/Controllers/RelatorioController.php:284
 * @route '/relatorios/requisicoes/export'
 */
exportRequisicoesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportRequisicoes.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

exportRequisicoes.form = exportRequisicoesForm;

/**
 * @see \App\Http\Controllers\RelatorioController::exportFornecedores
 * @see app/Http/Controllers/RelatorioController.php:375
 * @route '/relatorios/fornecedores/export'
 */
export const exportFornecedores = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportFornecedores.url(options),
    method: 'get',
});

exportFornecedores.definition = {
    methods: ['get', 'head'],
    url: '/relatorios/fornecedores/export',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\RelatorioController::exportFornecedores
 * @see app/Http/Controllers/RelatorioController.php:375
 * @route '/relatorios/fornecedores/export'
 */
exportFornecedores.url = (options?: RouteQueryOptions) => {
    return exportFornecedores.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\RelatorioController::exportFornecedores
 * @see app/Http/Controllers/RelatorioController.php:375
 * @route '/relatorios/fornecedores/export'
 */
exportFornecedores.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportFornecedores.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RelatorioController::exportFornecedores
 * @see app/Http/Controllers/RelatorioController.php:375
 * @route '/relatorios/fornecedores/export'
 */
exportFornecedores.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportFornecedores.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\RelatorioController::exportFornecedores
 * @see app/Http/Controllers/RelatorioController.php:375
 * @route '/relatorios/fornecedores/export'
 */
const exportFornecedoresForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportFornecedores.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RelatorioController::exportFornecedores
 * @see app/Http/Controllers/RelatorioController.php:375
 * @route '/relatorios/fornecedores/export'
 */
exportFornecedoresForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportFornecedores.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RelatorioController::exportFornecedores
 * @see app/Http/Controllers/RelatorioController.php:375
 * @route '/relatorios/fornecedores/export'
 */
exportFornecedoresForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportFornecedores.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

exportFornecedores.form = exportFornecedoresForm;

/**
 * @see \App\Http\Controllers\RelatorioController::exportConferencias
 * @see app/Http/Controllers/RelatorioController.php:474
 * @route '/relatorios/conferencias/export'
 */
export const exportConferencias = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportConferencias.url(options),
    method: 'get',
});

exportConferencias.definition = {
    methods: ['get', 'head'],
    url: '/relatorios/conferencias/export',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\RelatorioController::exportConferencias
 * @see app/Http/Controllers/RelatorioController.php:474
 * @route '/relatorios/conferencias/export'
 */
exportConferencias.url = (options?: RouteQueryOptions) => {
    return exportConferencias.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\RelatorioController::exportConferencias
 * @see app/Http/Controllers/RelatorioController.php:474
 * @route '/relatorios/conferencias/export'
 */
exportConferencias.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportConferencias.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RelatorioController::exportConferencias
 * @see app/Http/Controllers/RelatorioController.php:474
 * @route '/relatorios/conferencias/export'
 */
exportConferencias.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportConferencias.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\RelatorioController::exportConferencias
 * @see app/Http/Controllers/RelatorioController.php:474
 * @route '/relatorios/conferencias/export'
 */
const exportConferenciasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportConferencias.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RelatorioController::exportConferencias
 * @see app/Http/Controllers/RelatorioController.php:474
 * @route '/relatorios/conferencias/export'
 */
exportConferenciasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportConferencias.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RelatorioController::exportConferencias
 * @see app/Http/Controllers/RelatorioController.php:474
 * @route '/relatorios/conferencias/export'
 */
exportConferenciasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportConferencias.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

exportConferencias.form = exportConferenciasForm;

/**
 * @see \App\Http\Controllers\RelatorioController::index
 * @see app/Http/Controllers/RelatorioController.php:17
 * @route '/relatorios'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/relatorios',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\RelatorioController::index
 * @see app/Http/Controllers/RelatorioController.php:17
 * @route '/relatorios'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\RelatorioController::index
 * @see app/Http/Controllers/RelatorioController.php:17
 * @route '/relatorios'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RelatorioController::index
 * @see app/Http/Controllers/RelatorioController.php:17
 * @route '/relatorios'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\RelatorioController::index
 * @see app/Http/Controllers/RelatorioController.php:17
 * @route '/relatorios'
 */
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RelatorioController::index
 * @see app/Http/Controllers/RelatorioController.php:17
 * @route '/relatorios'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RelatorioController::index
 * @see app/Http/Controllers/RelatorioController.php:17
 * @route '/relatorios'
 */
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

index.form = indexForm;

/**
 * @see \App\Http\Controllers\RelatorioController::requisicoes
 * @see app/Http/Controllers/RelatorioController.php:51
 * @route '/relatorios/requisicoes'
 */
export const requisicoes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: requisicoes.url(options),
    method: 'get',
});

requisicoes.definition = {
    methods: ['get', 'head'],
    url: '/relatorios/requisicoes',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\RelatorioController::requisicoes
 * @see app/Http/Controllers/RelatorioController.php:51
 * @route '/relatorios/requisicoes'
 */
requisicoes.url = (options?: RouteQueryOptions) => {
    return requisicoes.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\RelatorioController::requisicoes
 * @see app/Http/Controllers/RelatorioController.php:51
 * @route '/relatorios/requisicoes'
 */
requisicoes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: requisicoes.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RelatorioController::requisicoes
 * @see app/Http/Controllers/RelatorioController.php:51
 * @route '/relatorios/requisicoes'
 */
requisicoes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: requisicoes.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\RelatorioController::requisicoes
 * @see app/Http/Controllers/RelatorioController.php:51
 * @route '/relatorios/requisicoes'
 */
const requisicoesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: requisicoes.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RelatorioController::requisicoes
 * @see app/Http/Controllers/RelatorioController.php:51
 * @route '/relatorios/requisicoes'
 */
requisicoesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: requisicoes.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RelatorioController::requisicoes
 * @see app/Http/Controllers/RelatorioController.php:51
 * @route '/relatorios/requisicoes'
 */
requisicoesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: requisicoes.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

requisicoes.form = requisicoesForm;

/**
 * @see \App\Http\Controllers\RelatorioController::fornecedores
 * @see app/Http/Controllers/RelatorioController.php:142
 * @route '/relatorios/fornecedores'
 */
export const fornecedores = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fornecedores.url(options),
    method: 'get',
});

fornecedores.definition = {
    methods: ['get', 'head'],
    url: '/relatorios/fornecedores',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\RelatorioController::fornecedores
 * @see app/Http/Controllers/RelatorioController.php:142
 * @route '/relatorios/fornecedores'
 */
fornecedores.url = (options?: RouteQueryOptions) => {
    return fornecedores.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\RelatorioController::fornecedores
 * @see app/Http/Controllers/RelatorioController.php:142
 * @route '/relatorios/fornecedores'
 */
fornecedores.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fornecedores.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RelatorioController::fornecedores
 * @see app/Http/Controllers/RelatorioController.php:142
 * @route '/relatorios/fornecedores'
 */
fornecedores.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: fornecedores.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\RelatorioController::fornecedores
 * @see app/Http/Controllers/RelatorioController.php:142
 * @route '/relatorios/fornecedores'
 */
const fornecedoresForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fornecedores.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RelatorioController::fornecedores
 * @see app/Http/Controllers/RelatorioController.php:142
 * @route '/relatorios/fornecedores'
 */
fornecedoresForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fornecedores.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RelatorioController::fornecedores
 * @see app/Http/Controllers/RelatorioController.php:142
 * @route '/relatorios/fornecedores'
 */
fornecedoresForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fornecedores.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

fornecedores.form = fornecedoresForm;

/**
 * @see \App\Http\Controllers\RelatorioController::conferencias
 * @see app/Http/Controllers/RelatorioController.php:212
 * @route '/relatorios/conferencias'
 */
export const conferencias = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: conferencias.url(options),
    method: 'get',
});

conferencias.definition = {
    methods: ['get', 'head'],
    url: '/relatorios/conferencias',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\RelatorioController::conferencias
 * @see app/Http/Controllers/RelatorioController.php:212
 * @route '/relatorios/conferencias'
 */
conferencias.url = (options?: RouteQueryOptions) => {
    return conferencias.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\RelatorioController::conferencias
 * @see app/Http/Controllers/RelatorioController.php:212
 * @route '/relatorios/conferencias'
 */
conferencias.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: conferencias.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RelatorioController::conferencias
 * @see app/Http/Controllers/RelatorioController.php:212
 * @route '/relatorios/conferencias'
 */
conferencias.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: conferencias.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\RelatorioController::conferencias
 * @see app/Http/Controllers/RelatorioController.php:212
 * @route '/relatorios/conferencias'
 */
const conferenciasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: conferencias.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RelatorioController::conferencias
 * @see app/Http/Controllers/RelatorioController.php:212
 * @route '/relatorios/conferencias'
 */
conferenciasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: conferencias.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RelatorioController::conferencias
 * @see app/Http/Controllers/RelatorioController.php:212
 * @route '/relatorios/conferencias'
 */
conferenciasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: conferencias.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

conferencias.form = conferenciasForm;

const RelatorioController = { exportRequisicoes, exportFornecedores, exportConferencias, index, requisicoes, fornecedores, conferencias };

export default RelatorioController;
