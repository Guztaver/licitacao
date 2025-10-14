@extends('layouts.app')

@section('content')
<div id="app" data-page="{{ Inertia::render('Relatorios/AveragePriceReportPage') }}"></div>
@endsection