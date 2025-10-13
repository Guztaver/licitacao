import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ItemController::index
* @see app/Http/Controllers/ItemController.php:21
* @route '/items'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/items',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ItemController::index
* @see app/Http/Controllers/ItemController.php:21
* @route '/items'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ItemController::index
* @see app/Http/Controllers/ItemController.php:21
* @route '/items'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ItemController::index
* @see app/Http/Controllers/ItemController.php:21
* @route '/items'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ItemController::index
* @see app/Http/Controllers/ItemController.php:21
* @route '/items'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ItemController::index
* @see app/Http/Controllers/ItemController.php:21
* @route '/items'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ItemController::index
* @see app/Http/Controllers/ItemController.php:21
* @route '/items'
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
* @see \App\Http\Controllers\ItemController::create
* @see app/Http/Controllers/ItemController.php:91
* @route '/items/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/items/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ItemController::create
* @see app/Http/Controllers/ItemController.php:91
* @route '/items/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ItemController::create
* @see app/Http/Controllers/ItemController.php:91
* @route '/items/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ItemController::create
* @see app/Http/Controllers/ItemController.php:91
* @route '/items/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ItemController::create
* @see app/Http/Controllers/ItemController.php:91
* @route '/items/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ItemController::create
* @see app/Http/Controllers/ItemController.php:91
* @route '/items/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ItemController::create
* @see app/Http/Controllers/ItemController.php:91
* @route '/items/create'
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
* @see \App\Http\Controllers\ItemController::store
* @see app/Http/Controllers/ItemController.php:99
* @route '/items'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/items',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ItemController::store
* @see app/Http/Controllers/ItemController.php:99
* @route '/items'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ItemController::store
* @see app/Http/Controllers/ItemController.php:99
* @route '/items'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ItemController::store
* @see app/Http/Controllers/ItemController.php:99
* @route '/items'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ItemController::store
* @see app/Http/Controllers/ItemController.php:99
* @route '/items'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\ItemController::show
* @see app/Http/Controllers/ItemController.php:123
* @route '/items/{item}'
*/
export const show = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/items/{item}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ItemController::show
* @see app/Http/Controllers/ItemController.php:123
* @route '/items/{item}'
*/
show.url = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { item: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { item: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            item: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        item: typeof args.item === 'object'
        ? args.item.id
        : args.item,
    }

    return show.definition.url
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ItemController::show
* @see app/Http/Controllers/ItemController.php:123
* @route '/items/{item}'
*/
show.get = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ItemController::show
* @see app/Http/Controllers/ItemController.php:123
* @route '/items/{item}'
*/
show.head = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ItemController::show
* @see app/Http/Controllers/ItemController.php:123
* @route '/items/{item}'
*/
const showForm = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ItemController::show
* @see app/Http/Controllers/ItemController.php:123
* @route '/items/{item}'
*/
showForm.get = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ItemController::show
* @see app/Http/Controllers/ItemController.php:123
* @route '/items/{item}'
*/
showForm.head = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ItemController::edit
* @see app/Http/Controllers/ItemController.php:133
* @route '/items/{item}/edit'
*/
export const edit = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/items/{item}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ItemController::edit
* @see app/Http/Controllers/ItemController.php:133
* @route '/items/{item}/edit'
*/
edit.url = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { item: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { item: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            item: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        item: typeof args.item === 'object'
        ? args.item.id
        : args.item,
    }

    return edit.definition.url
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ItemController::edit
* @see app/Http/Controllers/ItemController.php:133
* @route '/items/{item}/edit'
*/
edit.get = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ItemController::edit
* @see app/Http/Controllers/ItemController.php:133
* @route '/items/{item}/edit'
*/
edit.head = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ItemController::edit
* @see app/Http/Controllers/ItemController.php:133
* @route '/items/{item}/edit'
*/
const editForm = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ItemController::edit
* @see app/Http/Controllers/ItemController.php:133
* @route '/items/{item}/edit'
*/
editForm.get = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ItemController::edit
* @see app/Http/Controllers/ItemController.php:133
* @route '/items/{item}/edit'
*/
editForm.head = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ItemController::update
* @see app/Http/Controllers/ItemController.php:143
* @route '/items/{item}'
*/
export const update = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/items/{item}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ItemController::update
* @see app/Http/Controllers/ItemController.php:143
* @route '/items/{item}'
*/
update.url = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { item: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { item: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            item: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        item: typeof args.item === 'object'
        ? args.item.id
        : args.item,
    }

    return update.definition.url
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ItemController::update
* @see app/Http/Controllers/ItemController.php:143
* @route '/items/{item}'
*/
update.put = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ItemController::update
* @see app/Http/Controllers/ItemController.php:143
* @route '/items/{item}'
*/
update.patch = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\ItemController::update
* @see app/Http/Controllers/ItemController.php:143
* @route '/items/{item}'
*/
const updateForm = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ItemController::update
* @see app/Http/Controllers/ItemController.php:143
* @route '/items/{item}'
*/
updateForm.put = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ItemController::update
* @see app/Http/Controllers/ItemController.php:143
* @route '/items/{item}'
*/
updateForm.patch = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ItemController::destroy
* @see app/Http/Controllers/ItemController.php:172
* @route '/items/{item}'
*/
export const destroy = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/items/{item}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ItemController::destroy
* @see app/Http/Controllers/ItemController.php:172
* @route '/items/{item}'
*/
destroy.url = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { item: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { item: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            item: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        item: typeof args.item === 'object'
        ? args.item.id
        : args.item,
    }

    return destroy.definition.url
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ItemController::destroy
* @see app/Http/Controllers/ItemController.php:172
* @route '/items/{item}'
*/
destroy.delete = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\ItemController::destroy
* @see app/Http/Controllers/ItemController.php:172
* @route '/items/{item}'
*/
const destroyForm = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ItemController::destroy
* @see app/Http/Controllers/ItemController.php:172
* @route '/items/{item}'
*/
destroyForm.delete = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ItemController::importMethod
* @see app/Http/Controllers/ItemController.php:263
* @route '/items-import'
*/
export const importMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

importMethod.definition = {
    methods: ["post"],
    url: '/items-import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ItemController::importMethod
* @see app/Http/Controllers/ItemController.php:263
* @route '/items-import'
*/
importMethod.url = (options?: RouteQueryOptions) => {
    return importMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ItemController::importMethod
* @see app/Http/Controllers/ItemController.php:263
* @route '/items-import'
*/
importMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ItemController::importMethod
* @see app/Http/Controllers/ItemController.php:263
* @route '/items-import'
*/
const importMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: importMethod.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ItemController::importMethod
* @see app/Http/Controllers/ItemController.php:263
* @route '/items-import'
*/
importMethodForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: importMethod.url(options),
    method: 'post',
})

importMethod.form = importMethodForm

/**
* @see \App\Http\Controllers\ItemController::exportMethod
* @see app/Http/Controllers/ItemController.php:368
* @route '/items-export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/items-export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ItemController::exportMethod
* @see app/Http/Controllers/ItemController.php:368
* @route '/items-export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ItemController::exportMethod
* @see app/Http/Controllers/ItemController.php:368
* @route '/items-export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ItemController::exportMethod
* @see app/Http/Controllers/ItemController.php:368
* @route '/items-export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ItemController::exportMethod
* @see app/Http/Controllers/ItemController.php:368
* @route '/items-export'
*/
const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ItemController::exportMethod
* @see app/Http/Controllers/ItemController.php:368
* @route '/items-export'
*/
exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ItemController::exportMethod
* @see app/Http/Controllers/ItemController.php:368
* @route '/items-export'
*/
exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exportMethod.form = exportMethodForm

/**
* @see \App\Http\Controllers\ItemController::downloadTemplate
* @see app/Http/Controllers/ItemController.php:442
* @route '/items-template'
*/
export const downloadTemplate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadTemplate.url(options),
    method: 'get',
})

downloadTemplate.definition = {
    methods: ["get","head"],
    url: '/items-template',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ItemController::downloadTemplate
* @see app/Http/Controllers/ItemController.php:442
* @route '/items-template'
*/
downloadTemplate.url = (options?: RouteQueryOptions) => {
    return downloadTemplate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ItemController::downloadTemplate
* @see app/Http/Controllers/ItemController.php:442
* @route '/items-template'
*/
downloadTemplate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadTemplate.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ItemController::downloadTemplate
* @see app/Http/Controllers/ItemController.php:442
* @route '/items-template'
*/
downloadTemplate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadTemplate.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ItemController::downloadTemplate
* @see app/Http/Controllers/ItemController.php:442
* @route '/items-template'
*/
const downloadTemplateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadTemplate.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ItemController::downloadTemplate
* @see app/Http/Controllers/ItemController.php:442
* @route '/items-template'
*/
downloadTemplateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadTemplate.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ItemController::downloadTemplate
* @see app/Http/Controllers/ItemController.php:442
* @route '/items-template'
*/
downloadTemplateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadTemplate.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

downloadTemplate.form = downloadTemplateForm

/**
* @see \App\Http\Controllers\ItemController::auditLogs
* @see app/Http/Controllers/ItemController.php:194
* @route '/items/{item}/audit-logs'
*/
export const auditLogs = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: auditLogs.url(args, options),
    method: 'get',
})

auditLogs.definition = {
    methods: ["get","head"],
    url: '/items/{item}/audit-logs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ItemController::auditLogs
* @see app/Http/Controllers/ItemController.php:194
* @route '/items/{item}/audit-logs'
*/
auditLogs.url = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { item: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { item: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            item: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        item: typeof args.item === 'object'
        ? args.item.id
        : args.item,
    }

    return auditLogs.definition.url
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ItemController::auditLogs
* @see app/Http/Controllers/ItemController.php:194
* @route '/items/{item}/audit-logs'
*/
auditLogs.get = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: auditLogs.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ItemController::auditLogs
* @see app/Http/Controllers/ItemController.php:194
* @route '/items/{item}/audit-logs'
*/
auditLogs.head = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: auditLogs.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ItemController::auditLogs
* @see app/Http/Controllers/ItemController.php:194
* @route '/items/{item}/audit-logs'
*/
const auditLogsForm = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: auditLogs.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ItemController::auditLogs
* @see app/Http/Controllers/ItemController.php:194
* @route '/items/{item}/audit-logs'
*/
auditLogsForm.get = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: auditLogs.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ItemController::auditLogs
* @see app/Http/Controllers/ItemController.php:194
* @route '/items/{item}/audit-logs'
*/
auditLogsForm.head = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: auditLogs.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

auditLogs.form = auditLogsForm

/**
* @see \App\Http\Controllers\ItemController::freeze
* @see app/Http/Controllers/ItemController.php:243
* @route '/items/{item}/freeze'
*/
export const freeze = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: freeze.url(args, options),
    method: 'post',
})

freeze.definition = {
    methods: ["post"],
    url: '/items/{item}/freeze',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ItemController::freeze
* @see app/Http/Controllers/ItemController.php:243
* @route '/items/{item}/freeze'
*/
freeze.url = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { item: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { item: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            item: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        item: typeof args.item === 'object'
        ? args.item.id
        : args.item,
    }

    return freeze.definition.url
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ItemController::freeze
* @see app/Http/Controllers/ItemController.php:243
* @route '/items/{item}/freeze'
*/
freeze.post = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: freeze.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ItemController::freeze
* @see app/Http/Controllers/ItemController.php:243
* @route '/items/{item}/freeze'
*/
const freezeForm = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: freeze.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ItemController::freeze
* @see app/Http/Controllers/ItemController.php:243
* @route '/items/{item}/freeze'
*/
freezeForm.post = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: freeze.url(args, options),
    method: 'post',
})

freeze.form = freezeForm

const ItemController = { index, create, store, show, edit, update, destroy, importMethod, exportMethod, downloadTemplate, auditLogs, freeze, import: importMethod, export: exportMethod }

export default ItemController