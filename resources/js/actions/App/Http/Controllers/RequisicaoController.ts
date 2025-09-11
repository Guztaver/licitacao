import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RequisicaoController::index
* @see app/Http/Controllers/RequisicaoController.php:23
* @route '/requisicoes'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/requisicoes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RequisicaoController::index
* @see app/Http/Controllers/RequisicaoController.php:23
* @route '/requisicoes'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RequisicaoController::index
* @see app/Http/Controllers/RequisicaoController.php:23
* @route '/requisicoes'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RequisicaoController::index
* @see app/Http/Controllers/RequisicaoController.php:23
* @route '/requisicoes'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RequisicaoController::create
* @see app/Http/Controllers/RequisicaoController.php:127
* @route '/requisicoes/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/requisicoes/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RequisicaoController::create
* @see app/Http/Controllers/RequisicaoController.php:127
* @route '/requisicoes/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RequisicaoController::create
* @see app/Http/Controllers/RequisicaoController.php:127
* @route '/requisicoes/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RequisicaoController::create
* @see app/Http/Controllers/RequisicaoController.php:127
* @route '/requisicoes/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RequisicaoController::store
* @see app/Http/Controllers/RequisicaoController.php:142
* @route '/requisicoes'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/requisicoes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RequisicaoController::store
* @see app/Http/Controllers/RequisicaoController.php:142
* @route '/requisicoes'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RequisicaoController::store
* @see app/Http/Controllers/RequisicaoController.php:142
* @route '/requisicoes'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RequisicaoController::show
* @see app/Http/Controllers/RequisicaoController.php:180
* @route '/requisicoes/{requisicao}'
*/
export const show = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/requisicoes/{requisicao}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RequisicaoController::show
* @see app/Http/Controllers/RequisicaoController.php:180
* @route '/requisicoes/{requisicao}'
*/
show.url = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { requisicao: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { requisicao: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            requisicao: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        requisicao: typeof args.requisicao === 'object'
        ? args.requisicao.id
        : args.requisicao,
    }

    return show.definition.url
            .replace('{requisicao}', parsedArgs.requisicao.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RequisicaoController::show
* @see app/Http/Controllers/RequisicaoController.php:180
* @route '/requisicoes/{requisicao}'
*/
show.get = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RequisicaoController::show
* @see app/Http/Controllers/RequisicaoController.php:180
* @route '/requisicoes/{requisicao}'
*/
show.head = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RequisicaoController::edit
* @see app/Http/Controllers/RequisicaoController.php:266
* @route '/requisicoes/{requisicao}/edit'
*/
export const edit = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/requisicoes/{requisicao}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RequisicaoController::edit
* @see app/Http/Controllers/RequisicaoController.php:266
* @route '/requisicoes/{requisicao}/edit'
*/
edit.url = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { requisicao: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { requisicao: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            requisicao: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        requisicao: typeof args.requisicao === 'object'
        ? args.requisicao.id
        : args.requisicao,
    }

    return edit.definition.url
            .replace('{requisicao}', parsedArgs.requisicao.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RequisicaoController::edit
* @see app/Http/Controllers/RequisicaoController.php:266
* @route '/requisicoes/{requisicao}/edit'
*/
edit.get = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RequisicaoController::edit
* @see app/Http/Controllers/RequisicaoController.php:266
* @route '/requisicoes/{requisicao}/edit'
*/
edit.head = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RequisicaoController::update
* @see app/Http/Controllers/RequisicaoController.php:297
* @route '/requisicoes/{requisicao}'
*/
export const update = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/requisicoes/{requisicao}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\RequisicaoController::update
* @see app/Http/Controllers/RequisicaoController.php:297
* @route '/requisicoes/{requisicao}'
*/
update.url = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { requisicao: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { requisicao: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            requisicao: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        requisicao: typeof args.requisicao === 'object'
        ? args.requisicao.id
        : args.requisicao,
    }

    return update.definition.url
            .replace('{requisicao}', parsedArgs.requisicao.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RequisicaoController::update
* @see app/Http/Controllers/RequisicaoController.php:297
* @route '/requisicoes/{requisicao}'
*/
update.put = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\RequisicaoController::update
* @see app/Http/Controllers/RequisicaoController.php:297
* @route '/requisicoes/{requisicao}'
*/
update.patch = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\RequisicaoController::destroy
* @see app/Http/Controllers/RequisicaoController.php:362
* @route '/requisicoes/{requisicao}'
*/
export const destroy = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/requisicoes/{requisicao}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\RequisicaoController::destroy
* @see app/Http/Controllers/RequisicaoController.php:362
* @route '/requisicoes/{requisicao}'
*/
destroy.url = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { requisicao: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { requisicao: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            requisicao: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        requisicao: typeof args.requisicao === 'object'
        ? args.requisicao.id
        : args.requisicao,
    }

    return destroy.definition.url
            .replace('{requisicao}', parsedArgs.requisicao.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RequisicaoController::destroy
* @see app/Http/Controllers/RequisicaoController.php:362
* @route '/requisicoes/{requisicao}'
*/
destroy.delete = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\RequisicaoController::excluidas
* @see app/Http/Controllers/RequisicaoController.php:402
* @route '/requisicoes-excluidas'
*/
export const excluidas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: excluidas.url(options),
    method: 'get',
})

excluidas.definition = {
    methods: ["get","head"],
    url: '/requisicoes-excluidas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RequisicaoController::excluidas
* @see app/Http/Controllers/RequisicaoController.php:402
* @route '/requisicoes-excluidas'
*/
excluidas.url = (options?: RouteQueryOptions) => {
    return excluidas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RequisicaoController::excluidas
* @see app/Http/Controllers/RequisicaoController.php:402
* @route '/requisicoes-excluidas'
*/
excluidas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: excluidas.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RequisicaoController::excluidas
* @see app/Http/Controllers/RequisicaoController.php:402
* @route '/requisicoes-excluidas'
*/
excluidas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: excluidas.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RequisicaoController::exportMethod
* @see app/Http/Controllers/RequisicaoController.php:481
* @route '/requisicoes-export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/requisicoes-export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RequisicaoController::exportMethod
* @see app/Http/Controllers/RequisicaoController.php:481
* @route '/requisicoes-export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RequisicaoController::exportMethod
* @see app/Http/Controllers/RequisicaoController.php:481
* @route '/requisicoes-export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RequisicaoController::exportMethod
* @see app/Http/Controllers/RequisicaoController.php:481
* @route '/requisicoes-export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RequisicaoController::anexo
* @see app/Http/Controllers/RequisicaoController.php:461
* @route '/requisicoes/{requisicao}/anexo'
*/
export const anexo = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: anexo.url(args, options),
    method: 'get',
})

anexo.definition = {
    methods: ["get","head"],
    url: '/requisicoes/{requisicao}/anexo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RequisicaoController::anexo
* @see app/Http/Controllers/RequisicaoController.php:461
* @route '/requisicoes/{requisicao}/anexo'
*/
anexo.url = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { requisicao: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { requisicao: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            requisicao: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        requisicao: typeof args.requisicao === 'object'
        ? args.requisicao.id
        : args.requisicao,
    }

    return anexo.definition.url
            .replace('{requisicao}', parsedArgs.requisicao.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RequisicaoController::anexo
* @see app/Http/Controllers/RequisicaoController.php:461
* @route '/requisicoes/{requisicao}/anexo'
*/
anexo.get = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: anexo.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RequisicaoController::anexo
* @see app/Http/Controllers/RequisicaoController.php:461
* @route '/requisicoes/{requisicao}/anexo'
*/
anexo.head = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: anexo.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RequisicaoController::concretizar
* @see app/Http/Controllers/RequisicaoController.php:340
* @route '/requisicoes/{requisicao}/concretizar'
*/
export const concretizar = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: concretizar.url(args, options),
    method: 'post',
})

concretizar.definition = {
    methods: ["post"],
    url: '/requisicoes/{requisicao}/concretizar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RequisicaoController::concretizar
* @see app/Http/Controllers/RequisicaoController.php:340
* @route '/requisicoes/{requisicao}/concretizar'
*/
concretizar.url = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { requisicao: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { requisicao: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            requisicao: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        requisicao: typeof args.requisicao === 'object'
        ? args.requisicao.id
        : args.requisicao,
    }

    return concretizar.definition.url
            .replace('{requisicao}', parsedArgs.requisicao.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RequisicaoController::concretizar
* @see app/Http/Controllers/RequisicaoController.php:340
* @route '/requisicoes/{requisicao}/concretizar'
*/
concretizar.post = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: concretizar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RequisicaoController::cancelar
* @see app/Http/Controllers/RequisicaoController.php:382
* @route '/requisicoes/{requisicao}/cancelar'
*/
export const cancelar = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelar.url(args, options),
    method: 'post',
})

cancelar.definition = {
    methods: ["post"],
    url: '/requisicoes/{requisicao}/cancelar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RequisicaoController::cancelar
* @see app/Http/Controllers/RequisicaoController.php:382
* @route '/requisicoes/{requisicao}/cancelar'
*/
cancelar.url = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { requisicao: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { requisicao: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            requisicao: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        requisicao: typeof args.requisicao === 'object'
        ? args.requisicao.id
        : args.requisicao,
    }

    return cancelar.definition.url
            .replace('{requisicao}', parsedArgs.requisicao.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RequisicaoController::cancelar
* @see app/Http/Controllers/RequisicaoController.php:382
* @route '/requisicoes/{requisicao}/cancelar'
*/
cancelar.post = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RequisicaoController::pdf
* @see app/Http/Controllers/RequisicaoController.php:447
* @route '/requisicoes/{requisicao}/pdf'
*/
export const pdf = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

pdf.definition = {
    methods: ["get","head"],
    url: '/requisicoes/{requisicao}/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RequisicaoController::pdf
* @see app/Http/Controllers/RequisicaoController.php:447
* @route '/requisicoes/{requisicao}/pdf'
*/
pdf.url = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { requisicao: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { requisicao: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            requisicao: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        requisicao: typeof args.requisicao === 'object'
        ? args.requisicao.id
        : args.requisicao,
    }

    return pdf.definition.url
            .replace('{requisicao}', parsedArgs.requisicao.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RequisicaoController::pdf
* @see app/Http/Controllers/RequisicaoController.php:447
* @route '/requisicoes/{requisicao}/pdf'
*/
pdf.get = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RequisicaoController::pdf
* @see app/Http/Controllers/RequisicaoController.php:447
* @route '/requisicoes/{requisicao}/pdf'
*/
pdf.head = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pdf.url(args, options),
    method: 'head',
})

const RequisicaoController = { index, create, store, show, edit, update, destroy, excluidas, exportMethod, anexo, concretizar, cancelar, pdf, export: exportMethod }

export default RequisicaoController