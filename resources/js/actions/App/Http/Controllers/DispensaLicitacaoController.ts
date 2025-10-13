import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DispensaLicitacaoController::index
* @see [unknown]:0
* @route '/dispensas'
*/
const indexd69dc59839437db15006caa9f34d1022 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexd69dc59839437db15006caa9f34d1022.url(options),
    method: 'get',
})

indexd69dc59839437db15006caa9f34d1022.definition = {
    methods: ["get","head"],
    url: '/dispensas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::index
* @see [unknown]:0
* @route '/dispensas'
*/
indexd69dc59839437db15006caa9f34d1022.url = (options?: RouteQueryOptions) => {
    return indexd69dc59839437db15006caa9f34d1022.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::index
* @see [unknown]:0
* @route '/dispensas'
*/
indexd69dc59839437db15006caa9f34d1022.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexd69dc59839437db15006caa9f34d1022.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::index
* @see [unknown]:0
* @route '/dispensas'
*/
indexd69dc59839437db15006caa9f34d1022.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexd69dc59839437db15006caa9f34d1022.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::index
* @see [unknown]:0
* @route '/dispensas'
*/
const indexd69dc59839437db15006caa9f34d1022Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexd69dc59839437db15006caa9f34d1022.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::index
* @see [unknown]:0
* @route '/dispensas'
*/
indexd69dc59839437db15006caa9f34d1022Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexd69dc59839437db15006caa9f34d1022.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::index
* @see [unknown]:0
* @route '/dispensas'
*/
indexd69dc59839437db15006caa9f34d1022Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexd69dc59839437db15006caa9f34d1022.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

indexd69dc59839437db15006caa9f34d1022.form = indexd69dc59839437db15006caa9f34d1022Form
/**
* @see \App\Http\Controllers\DispensaLicitacaoController::index
* @see [unknown]:0
* @route '/api/dispensa-licitacoes'
*/
const index2bf8d047796728ebdf820208d77d92fa = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index2bf8d047796728ebdf820208d77d92fa.url(options),
    method: 'get',
})

index2bf8d047796728ebdf820208d77d92fa.definition = {
    methods: ["get","head"],
    url: '/api/dispensa-licitacoes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::index
* @see [unknown]:0
* @route '/api/dispensa-licitacoes'
*/
index2bf8d047796728ebdf820208d77d92fa.url = (options?: RouteQueryOptions) => {
    return index2bf8d047796728ebdf820208d77d92fa.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::index
* @see [unknown]:0
* @route '/api/dispensa-licitacoes'
*/
index2bf8d047796728ebdf820208d77d92fa.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index2bf8d047796728ebdf820208d77d92fa.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::index
* @see [unknown]:0
* @route '/api/dispensa-licitacoes'
*/
index2bf8d047796728ebdf820208d77d92fa.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index2bf8d047796728ebdf820208d77d92fa.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::index
* @see [unknown]:0
* @route '/api/dispensa-licitacoes'
*/
const index2bf8d047796728ebdf820208d77d92faForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index2bf8d047796728ebdf820208d77d92fa.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::index
* @see [unknown]:0
* @route '/api/dispensa-licitacoes'
*/
index2bf8d047796728ebdf820208d77d92faForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index2bf8d047796728ebdf820208d77d92fa.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::index
* @see [unknown]:0
* @route '/api/dispensa-licitacoes'
*/
index2bf8d047796728ebdf820208d77d92faForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index2bf8d047796728ebdf820208d77d92fa.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index2bf8d047796728ebdf820208d77d92fa.form = index2bf8d047796728ebdf820208d77d92faForm

export const index = {
    '/dispensas': indexd69dc59839437db15006caa9f34d1022,
    '/api/dispensa-licitacoes': index2bf8d047796728ebdf820208d77d92fa,
}

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::store
* @see [unknown]:0
* @route '/dispensas'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/dispensas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::store
* @see [unknown]:0
* @route '/dispensas'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::store
* @see [unknown]:0
* @route '/dispensas'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::store
* @see [unknown]:0
* @route '/dispensas'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::store
* @see [unknown]:0
* @route '/dispensas'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::create
* @see [unknown]:0
* @route '/dispensas/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/dispensas/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::create
* @see [unknown]:0
* @route '/dispensas/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::create
* @see [unknown]:0
* @route '/dispensas/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::create
* @see [unknown]:0
* @route '/dispensas/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::create
* @see [unknown]:0
* @route '/dispensas/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::create
* @see [unknown]:0
* @route '/dispensas/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::create
* @see [unknown]:0
* @route '/dispensas/create'
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
* @see \App\Http\Controllers\DispensaLicitacaoController::show
* @see [unknown]:0
* @route '/dispensas/{dispensa}'
*/
export const show = (args: { dispensa: string | number } | [dispensa: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/dispensas/{dispensa}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::show
* @see [unknown]:0
* @route '/dispensas/{dispensa}'
*/
show.url = (args: { dispensa: string | number } | [dispensa: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { dispensa: args }
    }

    if (Array.isArray(args)) {
        args = {
            dispensa: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        dispensa: args.dispensa,
    }

    return show.definition.url
            .replace('{dispensa}', parsedArgs.dispensa.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::show
* @see [unknown]:0
* @route '/dispensas/{dispensa}'
*/
show.get = (args: { dispensa: string | number } | [dispensa: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::show
* @see [unknown]:0
* @route '/dispensas/{dispensa}'
*/
show.head = (args: { dispensa: string | number } | [dispensa: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::show
* @see [unknown]:0
* @route '/dispensas/{dispensa}'
*/
const showForm = (args: { dispensa: string | number } | [dispensa: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::show
* @see [unknown]:0
* @route '/dispensas/{dispensa}'
*/
showForm.get = (args: { dispensa: string | number } | [dispensa: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::show
* @see [unknown]:0
* @route '/dispensas/{dispensa}'
*/
showForm.head = (args: { dispensa: string | number } | [dispensa: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\DispensaLicitacaoController::update
* @see [unknown]:0
* @route '/dispensas/{dispensa}'
*/
export const update = (args: { dispensa: string | number } | [dispensa: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/dispensas/{dispensa}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::update
* @see [unknown]:0
* @route '/dispensas/{dispensa}'
*/
update.url = (args: { dispensa: string | number } | [dispensa: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { dispensa: args }
    }

    if (Array.isArray(args)) {
        args = {
            dispensa: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        dispensa: args.dispensa,
    }

    return update.definition.url
            .replace('{dispensa}', parsedArgs.dispensa.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::update
* @see [unknown]:0
* @route '/dispensas/{dispensa}'
*/
update.put = (args: { dispensa: string | number } | [dispensa: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::update
* @see [unknown]:0
* @route '/dispensas/{dispensa}'
*/
const updateForm = (args: { dispensa: string | number } | [dispensa: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::update
* @see [unknown]:0
* @route '/dispensas/{dispensa}'
*/
updateForm.put = (args: { dispensa: string | number } | [dispensa: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::destroy
* @see [unknown]:0
* @route '/dispensas/{dispensa}'
*/
export const destroy = (args: { dispensa: string | number } | [dispensa: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/dispensas/{dispensa}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::destroy
* @see [unknown]:0
* @route '/dispensas/{dispensa}'
*/
destroy.url = (args: { dispensa: string | number } | [dispensa: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { dispensa: args }
    }

    if (Array.isArray(args)) {
        args = {
            dispensa: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        dispensa: args.dispensa,
    }

    return destroy.definition.url
            .replace('{dispensa}', parsedArgs.dispensa.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::destroy
* @see [unknown]:0
* @route '/dispensas/{dispensa}'
*/
destroy.delete = (args: { dispensa: string | number } | [dispensa: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::destroy
* @see [unknown]:0
* @route '/dispensas/{dispensa}'
*/
const destroyForm = (args: { dispensa: string | number } | [dispensa: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::destroy
* @see [unknown]:0
* @route '/dispensas/{dispensa}'
*/
destroyForm.delete = (args: { dispensa: string | number } | [dispensa: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\DispensaLicitacaoController::cancelar
* @see [unknown]:0
* @route '/dispensas/{dispensa}/cancelar'
*/
export const cancelar = (args: { dispensa: string | number } | [dispensa: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelar.url(args, options),
    method: 'post',
})

cancelar.definition = {
    methods: ["post"],
    url: '/dispensas/{dispensa}/cancelar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::cancelar
* @see [unknown]:0
* @route '/dispensas/{dispensa}/cancelar'
*/
cancelar.url = (args: { dispensa: string | number } | [dispensa: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { dispensa: args }
    }

    if (Array.isArray(args)) {
        args = {
            dispensa: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        dispensa: args.dispensa,
    }

    return cancelar.definition.url
            .replace('{dispensa}', parsedArgs.dispensa.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::cancelar
* @see [unknown]:0
* @route '/dispensas/{dispensa}/cancelar'
*/
cancelar.post = (args: { dispensa: string | number } | [dispensa: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::cancelar
* @see [unknown]:0
* @route '/dispensas/{dispensa}/cancelar'
*/
const cancelarForm = (args: { dispensa: string | number } | [dispensa: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancelar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::cancelar
* @see [unknown]:0
* @route '/dispensas/{dispensa}/cancelar'
*/
cancelarForm.post = (args: { dispensa: string | number } | [dispensa: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancelar.url(args, options),
    method: 'post',
})

cancelar.form = cancelarForm

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::validar
* @see [unknown]:0
* @route '/dispensas/validar'
*/
export const validar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validar.url(options),
    method: 'post',
})

validar.definition = {
    methods: ["post"],
    url: '/dispensas/validar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::validar
* @see [unknown]:0
* @route '/dispensas/validar'
*/
validar.url = (options?: RouteQueryOptions) => {
    return validar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::validar
* @see [unknown]:0
* @route '/dispensas/validar'
*/
validar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validar.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::validar
* @see [unknown]:0
* @route '/dispensas/validar'
*/
const validarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: validar.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DispensaLicitacaoController::validar
* @see [unknown]:0
* @route '/dispensas/validar'
*/
validarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: validar.url(options),
    method: 'post',
})

validar.form = validarForm

const DispensaLicitacaoController = { index, store, create, show, update, destroy, cancelar, validar }

export default DispensaLicitacaoController