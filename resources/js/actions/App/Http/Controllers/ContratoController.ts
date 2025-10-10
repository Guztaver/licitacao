import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ContratoController::index
* @see app/Http/Controllers/ContratoController.php:18
* @route '/contratos'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/contratos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ContratoController::index
* @see app/Http/Controllers/ContratoController.php:18
* @route '/contratos'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ContratoController::index
* @see app/Http/Controllers/ContratoController.php:18
* @route '/contratos'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ContratoController::index
* @see app/Http/Controllers/ContratoController.php:18
* @route '/contratos'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ContratoController::index
* @see app/Http/Controllers/ContratoController.php:18
* @route '/contratos'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ContratoController::index
* @see app/Http/Controllers/ContratoController.php:18
* @route '/contratos'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ContratoController::index
* @see app/Http/Controllers/ContratoController.php:18
* @route '/contratos'
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
* @see \App\Http\Controllers\ContratoController::create
* @see app/Http/Controllers/ContratoController.php:95
* @route '/contratos/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/contratos/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ContratoController::create
* @see app/Http/Controllers/ContratoController.php:95
* @route '/contratos/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ContratoController::create
* @see app/Http/Controllers/ContratoController.php:95
* @route '/contratos/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ContratoController::create
* @see app/Http/Controllers/ContratoController.php:95
* @route '/contratos/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ContratoController::create
* @see app/Http/Controllers/ContratoController.php:95
* @route '/contratos/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ContratoController::create
* @see app/Http/Controllers/ContratoController.php:95
* @route '/contratos/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ContratoController::create
* @see app/Http/Controllers/ContratoController.php:95
* @route '/contratos/create'
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
* @see \App\Http\Controllers\ContratoController::store
* @see app/Http/Controllers/ContratoController.php:110
* @route '/contratos'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/contratos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ContratoController::store
* @see app/Http/Controllers/ContratoController.php:110
* @route '/contratos'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ContratoController::store
* @see app/Http/Controllers/ContratoController.php:110
* @route '/contratos'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ContratoController::store
* @see app/Http/Controllers/ContratoController.php:110
* @route '/contratos'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ContratoController::store
* @see app/Http/Controllers/ContratoController.php:110
* @route '/contratos'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\ContratoController::show
* @see app/Http/Controllers/ContratoController.php:145
* @route '/contratos/{contrato}'
*/
export const show = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/contratos/{contrato}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ContratoController::show
* @see app/Http/Controllers/ContratoController.php:145
* @route '/contratos/{contrato}'
*/
show.url = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { contrato: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { contrato: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            contrato: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        contrato: typeof args.contrato === 'object'
        ? args.contrato.id
        : args.contrato,
    }

    return show.definition.url
            .replace('{contrato}', parsedArgs.contrato.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ContratoController::show
* @see app/Http/Controllers/ContratoController.php:145
* @route '/contratos/{contrato}'
*/
show.get = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ContratoController::show
* @see app/Http/Controllers/ContratoController.php:145
* @route '/contratos/{contrato}'
*/
show.head = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ContratoController::show
* @see app/Http/Controllers/ContratoController.php:145
* @route '/contratos/{contrato}'
*/
const showForm = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ContratoController::show
* @see app/Http/Controllers/ContratoController.php:145
* @route '/contratos/{contrato}'
*/
showForm.get = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ContratoController::show
* @see app/Http/Controllers/ContratoController.php:145
* @route '/contratos/{contrato}'
*/
showForm.head = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ContratoController::edit
* @see app/Http/Controllers/ContratoController.php:271
* @route '/contratos/{contrato}/edit'
*/
export const edit = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/contratos/{contrato}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ContratoController::edit
* @see app/Http/Controllers/ContratoController.php:271
* @route '/contratos/{contrato}/edit'
*/
edit.url = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { contrato: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { contrato: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            contrato: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        contrato: typeof args.contrato === 'object'
        ? args.contrato.id
        : args.contrato,
    }

    return edit.definition.url
            .replace('{contrato}', parsedArgs.contrato.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ContratoController::edit
* @see app/Http/Controllers/ContratoController.php:271
* @route '/contratos/{contrato}/edit'
*/
edit.get = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ContratoController::edit
* @see app/Http/Controllers/ContratoController.php:271
* @route '/contratos/{contrato}/edit'
*/
edit.head = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ContratoController::edit
* @see app/Http/Controllers/ContratoController.php:271
* @route '/contratos/{contrato}/edit'
*/
const editForm = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ContratoController::edit
* @see app/Http/Controllers/ContratoController.php:271
* @route '/contratos/{contrato}/edit'
*/
editForm.get = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ContratoController::edit
* @see app/Http/Controllers/ContratoController.php:271
* @route '/contratos/{contrato}/edit'
*/
editForm.head = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ContratoController::update
* @see app/Http/Controllers/ContratoController.php:304
* @route '/contratos/{contrato}'
*/
export const update = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/contratos/{contrato}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ContratoController::update
* @see app/Http/Controllers/ContratoController.php:304
* @route '/contratos/{contrato}'
*/
update.url = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { contrato: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { contrato: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            contrato: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        contrato: typeof args.contrato === 'object'
        ? args.contrato.id
        : args.contrato,
    }

    return update.definition.url
            .replace('{contrato}', parsedArgs.contrato.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ContratoController::update
* @see app/Http/Controllers/ContratoController.php:304
* @route '/contratos/{contrato}'
*/
update.put = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ContratoController::update
* @see app/Http/Controllers/ContratoController.php:304
* @route '/contratos/{contrato}'
*/
update.patch = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\ContratoController::update
* @see app/Http/Controllers/ContratoController.php:304
* @route '/contratos/{contrato}'
*/
const updateForm = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ContratoController::update
* @see app/Http/Controllers/ContratoController.php:304
* @route '/contratos/{contrato}'
*/
updateForm.put = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ContratoController::update
* @see app/Http/Controllers/ContratoController.php:304
* @route '/contratos/{contrato}'
*/
updateForm.patch = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ContratoController::destroy
* @see app/Http/Controllers/ContratoController.php:346
* @route '/contratos/{contrato}'
*/
export const destroy = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/contratos/{contrato}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ContratoController::destroy
* @see app/Http/Controllers/ContratoController.php:346
* @route '/contratos/{contrato}'
*/
destroy.url = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { contrato: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { contrato: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            contrato: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        contrato: typeof args.contrato === 'object'
        ? args.contrato.id
        : args.contrato,
    }

    return destroy.definition.url
            .replace('{contrato}', parsedArgs.contrato.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ContratoController::destroy
* @see app/Http/Controllers/ContratoController.php:346
* @route '/contratos/{contrato}'
*/
destroy.delete = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\ContratoController::destroy
* @see app/Http/Controllers/ContratoController.php:346
* @route '/contratos/{contrato}'
*/
const destroyForm = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ContratoController::destroy
* @see app/Http/Controllers/ContratoController.php:346
* @route '/contratos/{contrato}'
*/
destroyForm.delete = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ContratoController::toggleStatus
* @see app/Http/Controllers/ContratoController.php:367
* @route '/contratos/{contrato}/toggle-status'
*/
export const toggleStatus = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

toggleStatus.definition = {
    methods: ["post"],
    url: '/contratos/{contrato}/toggle-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ContratoController::toggleStatus
* @see app/Http/Controllers/ContratoController.php:367
* @route '/contratos/{contrato}/toggle-status'
*/
toggleStatus.url = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { contrato: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { contrato: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            contrato: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        contrato: typeof args.contrato === 'object'
        ? args.contrato.id
        : args.contrato,
    }

    return toggleStatus.definition.url
            .replace('{contrato}', parsedArgs.contrato.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ContratoController::toggleStatus
* @see app/Http/Controllers/ContratoController.php:367
* @route '/contratos/{contrato}/toggle-status'
*/
toggleStatus.post = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ContratoController::toggleStatus
* @see app/Http/Controllers/ContratoController.php:367
* @route '/contratos/{contrato}/toggle-status'
*/
const toggleStatusForm = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleStatus.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ContratoController::toggleStatus
* @see app/Http/Controllers/ContratoController.php:367
* @route '/contratos/{contrato}/toggle-status'
*/
toggleStatusForm.post = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleStatus.url(args, options),
    method: 'post',
})

toggleStatus.form = toggleStatusForm

/**
* @see \App\Http\Controllers\ContratoController::checkLimits
* @see app/Http/Controllers/ContratoController.php:389
* @route '/contratos/check-limits'
*/
export const checkLimits = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkLimits.url(options),
    method: 'get',
})

checkLimits.definition = {
    methods: ["get","head"],
    url: '/contratos/check-limits',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ContratoController::checkLimits
* @see app/Http/Controllers/ContratoController.php:389
* @route '/contratos/check-limits'
*/
checkLimits.url = (options?: RouteQueryOptions) => {
    return checkLimits.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ContratoController::checkLimits
* @see app/Http/Controllers/ContratoController.php:389
* @route '/contratos/check-limits'
*/
checkLimits.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkLimits.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ContratoController::checkLimits
* @see app/Http/Controllers/ContratoController.php:389
* @route '/contratos/check-limits'
*/
checkLimits.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkLimits.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ContratoController::checkLimits
* @see app/Http/Controllers/ContratoController.php:389
* @route '/contratos/check-limits'
*/
const checkLimitsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: checkLimits.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ContratoController::checkLimits
* @see app/Http/Controllers/ContratoController.php:389
* @route '/contratos/check-limits'
*/
checkLimitsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: checkLimits.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ContratoController::checkLimits
* @see app/Http/Controllers/ContratoController.php:389
* @route '/contratos/check-limits'
*/
checkLimitsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: checkLimits.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

checkLimits.form = checkLimitsForm

/**
* @see \App\Http\Controllers\ContratoController::historicoLimites
* @see app/Http/Controllers/ContratoController.php:437
* @route '/contratos/{contrato}/historico-limites'
*/
export const historicoLimites = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historicoLimites.url(args, options),
    method: 'get',
})

historicoLimites.definition = {
    methods: ["get","head"],
    url: '/contratos/{contrato}/historico-limites',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ContratoController::historicoLimites
* @see app/Http/Controllers/ContratoController.php:437
* @route '/contratos/{contrato}/historico-limites'
*/
historicoLimites.url = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { contrato: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { contrato: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            contrato: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        contrato: typeof args.contrato === 'object'
        ? args.contrato.id
        : args.contrato,
    }

    return historicoLimites.definition.url
            .replace('{contrato}', parsedArgs.contrato.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ContratoController::historicoLimites
* @see app/Http/Controllers/ContratoController.php:437
* @route '/contratos/{contrato}/historico-limites'
*/
historicoLimites.get = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historicoLimites.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ContratoController::historicoLimites
* @see app/Http/Controllers/ContratoController.php:437
* @route '/contratos/{contrato}/historico-limites'
*/
historicoLimites.head = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: historicoLimites.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ContratoController::historicoLimites
* @see app/Http/Controllers/ContratoController.php:437
* @route '/contratos/{contrato}/historico-limites'
*/
const historicoLimitesForm = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: historicoLimites.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ContratoController::historicoLimites
* @see app/Http/Controllers/ContratoController.php:437
* @route '/contratos/{contrato}/historico-limites'
*/
historicoLimitesForm.get = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: historicoLimites.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ContratoController::historicoLimites
* @see app/Http/Controllers/ContratoController.php:437
* @route '/contratos/{contrato}/historico-limites'
*/
historicoLimitesForm.head = (args: { contrato: number | { id: number } } | [contrato: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: historicoLimites.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

historicoLimites.form = historicoLimitesForm

const ContratoController = { index, create, store, show, edit, update, destroy, toggleStatus, checkLimits, historicoLimites }

export default ContratoController