import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::index
* @see app/Http/Controllers/ProcessoLicitatorioController.php:17
* @route '/processos-licitatorios'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/processos-licitatorios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::index
* @see app/Http/Controllers/ProcessoLicitatorioController.php:17
* @route '/processos-licitatorios'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::index
* @see app/Http/Controllers/ProcessoLicitatorioController.php:17
* @route '/processos-licitatorios'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::index
* @see app/Http/Controllers/ProcessoLicitatorioController.php:17
* @route '/processos-licitatorios'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::index
* @see app/Http/Controllers/ProcessoLicitatorioController.php:17
* @route '/processos-licitatorios'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::index
* @see app/Http/Controllers/ProcessoLicitatorioController.php:17
* @route '/processos-licitatorios'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::index
* @see app/Http/Controllers/ProcessoLicitatorioController.php:17
* @route '/processos-licitatorios'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::create
* @see app/Http/Controllers/ProcessoLicitatorioController.php:116
* @route '/processos-licitatorios/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/processos-licitatorios/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::create
* @see app/Http/Controllers/ProcessoLicitatorioController.php:116
* @route '/processos-licitatorios/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::create
* @see app/Http/Controllers/ProcessoLicitatorioController.php:116
* @route '/processos-licitatorios/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::create
* @see app/Http/Controllers/ProcessoLicitatorioController.php:116
* @route '/processos-licitatorios/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::create
* @see app/Http/Controllers/ProcessoLicitatorioController.php:116
* @route '/processos-licitatorios/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::create
* @see app/Http/Controllers/ProcessoLicitatorioController.php:116
* @route '/processos-licitatorios/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::create
* @see app/Http/Controllers/ProcessoLicitatorioController.php:116
* @route '/processos-licitatorios/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::store
* @see app/Http/Controllers/ProcessoLicitatorioController.php:132
* @route '/processos-licitatorios'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/processos-licitatorios',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::store
* @see app/Http/Controllers/ProcessoLicitatorioController.php:132
* @route '/processos-licitatorios'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::store
* @see app/Http/Controllers/ProcessoLicitatorioController.php:132
* @route '/processos-licitatorios'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::store
* @see app/Http/Controllers/ProcessoLicitatorioController.php:132
* @route '/processos-licitatorios'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::store
* @see app/Http/Controllers/ProcessoLicitatorioController.php:132
* @route '/processos-licitatorios'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::show
* @see app/Http/Controllers/ProcessoLicitatorioController.php:185
* @route '/processos-licitatorios/{processoLicitatorio}'
*/
export const show = (args: { processoLicitatorio: number | { id: number } } | [processoLicitatorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/processos-licitatorios/{processoLicitatorio}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::show
* @see app/Http/Controllers/ProcessoLicitatorioController.php:185
* @route '/processos-licitatorios/{processoLicitatorio}'
*/
show.url = (args: { processoLicitatorio: number | { id: number } } | [processoLicitatorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { processoLicitatorio: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { processoLicitatorio: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            processoLicitatorio: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        processoLicitatorio: typeof args.processoLicitatorio === 'object'
        ? args.processoLicitatorio.id
        : args.processoLicitatorio,
    }

    return show.definition.url
            .replace('{processoLicitatorio}', parsedArgs.processoLicitatorio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::show
* @see app/Http/Controllers/ProcessoLicitatorioController.php:185
* @route '/processos-licitatorios/{processoLicitatorio}'
*/
show.get = (args: { processoLicitatorio: number | { id: number } } | [processoLicitatorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::show
* @see app/Http/Controllers/ProcessoLicitatorioController.php:185
* @route '/processos-licitatorios/{processoLicitatorio}'
*/
show.head = (args: { processoLicitatorio: number | { id: number } } | [processoLicitatorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::show
* @see app/Http/Controllers/ProcessoLicitatorioController.php:185
* @route '/processos-licitatorios/{processoLicitatorio}'
*/
const showForm = (args: { processoLicitatorio: number | { id: number } } | [processoLicitatorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::show
* @see app/Http/Controllers/ProcessoLicitatorioController.php:185
* @route '/processos-licitatorios/{processoLicitatorio}'
*/
showForm.get = (args: { processoLicitatorio: number | { id: number } } | [processoLicitatorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::show
* @see app/Http/Controllers/ProcessoLicitatorioController.php:185
* @route '/processos-licitatorios/{processoLicitatorio}'
*/
showForm.head = (args: { processoLicitatorio: number | { id: number } } | [processoLicitatorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::edit
* @see app/Http/Controllers/ProcessoLicitatorioController.php:280
* @route '/processos-licitatorios/{processoLicitatorio}/edit'
*/
export const edit = (args: { processoLicitatorio: number | { id: number } } | [processoLicitatorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/processos-licitatorios/{processoLicitatorio}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::edit
* @see app/Http/Controllers/ProcessoLicitatorioController.php:280
* @route '/processos-licitatorios/{processoLicitatorio}/edit'
*/
edit.url = (args: { processoLicitatorio: number | { id: number } } | [processoLicitatorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { processoLicitatorio: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { processoLicitatorio: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            processoLicitatorio: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        processoLicitatorio: typeof args.processoLicitatorio === 'object'
        ? args.processoLicitatorio.id
        : args.processoLicitatorio,
    }

    return edit.definition.url
            .replace('{processoLicitatorio}', parsedArgs.processoLicitatorio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::edit
* @see app/Http/Controllers/ProcessoLicitatorioController.php:280
* @route '/processos-licitatorios/{processoLicitatorio}/edit'
*/
edit.get = (args: { processoLicitatorio: number | { id: number } } | [processoLicitatorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::edit
* @see app/Http/Controllers/ProcessoLicitatorioController.php:280
* @route '/processos-licitatorios/{processoLicitatorio}/edit'
*/
edit.head = (args: { processoLicitatorio: number | { id: number } } | [processoLicitatorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::edit
* @see app/Http/Controllers/ProcessoLicitatorioController.php:280
* @route '/processos-licitatorios/{processoLicitatorio}/edit'
*/
const editForm = (args: { processoLicitatorio: number | { id: number } } | [processoLicitatorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::edit
* @see app/Http/Controllers/ProcessoLicitatorioController.php:280
* @route '/processos-licitatorios/{processoLicitatorio}/edit'
*/
editForm.get = (args: { processoLicitatorio: number | { id: number } } | [processoLicitatorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::edit
* @see app/Http/Controllers/ProcessoLicitatorioController.php:280
* @route '/processos-licitatorios/{processoLicitatorio}/edit'
*/
editForm.head = (args: { processoLicitatorio: number | { id: number } } | [processoLicitatorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::update
* @see app/Http/Controllers/ProcessoLicitatorioController.php:328
* @route '/processos-licitatorios/{processoLicitatorio}'
*/
export const update = (args: { processoLicitatorio: number | { id: number } } | [processoLicitatorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/processos-licitatorios/{processoLicitatorio}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::update
* @see app/Http/Controllers/ProcessoLicitatorioController.php:328
* @route '/processos-licitatorios/{processoLicitatorio}'
*/
update.url = (args: { processoLicitatorio: number | { id: number } } | [processoLicitatorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { processoLicitatorio: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { processoLicitatorio: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            processoLicitatorio: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        processoLicitatorio: typeof args.processoLicitatorio === 'object'
        ? args.processoLicitatorio.id
        : args.processoLicitatorio,
    }

    return update.definition.url
            .replace('{processoLicitatorio}', parsedArgs.processoLicitatorio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::update
* @see app/Http/Controllers/ProcessoLicitatorioController.php:328
* @route '/processos-licitatorios/{processoLicitatorio}'
*/
update.put = (args: { processoLicitatorio: number | { id: number } } | [processoLicitatorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::update
* @see app/Http/Controllers/ProcessoLicitatorioController.php:328
* @route '/processos-licitatorios/{processoLicitatorio}'
*/
update.patch = (args: { processoLicitatorio: number | { id: number } } | [processoLicitatorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::update
* @see app/Http/Controllers/ProcessoLicitatorioController.php:328
* @route '/processos-licitatorios/{processoLicitatorio}'
*/
const updateForm = (args: { processoLicitatorio: number | { id: number } } | [processoLicitatorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::update
* @see app/Http/Controllers/ProcessoLicitatorioController.php:328
* @route '/processos-licitatorios/{processoLicitatorio}'
*/
updateForm.put = (args: { processoLicitatorio: number | { id: number } } | [processoLicitatorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::update
* @see app/Http/Controllers/ProcessoLicitatorioController.php:328
* @route '/processos-licitatorios/{processoLicitatorio}'
*/
updateForm.patch = (args: { processoLicitatorio: number | { id: number } } | [processoLicitatorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::destroy
* @see app/Http/Controllers/ProcessoLicitatorioController.php:390
* @route '/processos-licitatorios/{processoLicitatorio}'
*/
export const destroy = (args: { processoLicitatorio: number | { id: number } } | [processoLicitatorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/processos-licitatorios/{processoLicitatorio}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::destroy
* @see app/Http/Controllers/ProcessoLicitatorioController.php:390
* @route '/processos-licitatorios/{processoLicitatorio}'
*/
destroy.url = (args: { processoLicitatorio: number | { id: number } } | [processoLicitatorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { processoLicitatorio: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { processoLicitatorio: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            processoLicitatorio: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        processoLicitatorio: typeof args.processoLicitatorio === 'object'
        ? args.processoLicitatorio.id
        : args.processoLicitatorio,
    }

    return destroy.definition.url
            .replace('{processoLicitatorio}', parsedArgs.processoLicitatorio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::destroy
* @see app/Http/Controllers/ProcessoLicitatorioController.php:390
* @route '/processos-licitatorios/{processoLicitatorio}'
*/
destroy.delete = (args: { processoLicitatorio: number | { id: number } } | [processoLicitatorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::destroy
* @see app/Http/Controllers/ProcessoLicitatorioController.php:390
* @route '/processos-licitatorios/{processoLicitatorio}'
*/
const destroyForm = (args: { processoLicitatorio: number | { id: number } } | [processoLicitatorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::destroy
* @see app/Http/Controllers/ProcessoLicitatorioController.php:390
* @route '/processos-licitatorios/{processoLicitatorio}'
*/
destroyForm.delete = (args: { processoLicitatorio: number | { id: number } } | [processoLicitatorio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::apiIndex
* @see app/Http/Controllers/ProcessoLicitatorioController.php:0
* @route '/api/processos-licitatorios'
*/
export const apiIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiIndex.url(options),
    method: 'get',
})

apiIndex.definition = {
    methods: ["get","head"],
    url: '/api/processos-licitatorios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::apiIndex
* @see app/Http/Controllers/ProcessoLicitatorioController.php:0
* @route '/api/processos-licitatorios'
*/
apiIndex.url = (options?: RouteQueryOptions) => {
    return apiIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::apiIndex
* @see app/Http/Controllers/ProcessoLicitatorioController.php:0
* @route '/api/processos-licitatorios'
*/
apiIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiIndex.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::apiIndex
* @see app/Http/Controllers/ProcessoLicitatorioController.php:0
* @route '/api/processos-licitatorios'
*/
apiIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: apiIndex.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::apiIndex
* @see app/Http/Controllers/ProcessoLicitatorioController.php:0
* @route '/api/processos-licitatorios'
*/
const apiIndexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: apiIndex.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::apiIndex
* @see app/Http/Controllers/ProcessoLicitatorioController.php:0
* @route '/api/processos-licitatorios'
*/
apiIndexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: apiIndex.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProcessoLicitatorioController::apiIndex
* @see app/Http/Controllers/ProcessoLicitatorioController.php:0
* @route '/api/processos-licitatorios'
*/
apiIndexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: apiIndex.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

apiIndex.form = apiIndexForm

const ProcessoLicitatorioController = { index, create, store, show, edit, update, destroy, apiIndex }

export default ProcessoLicitatorioController