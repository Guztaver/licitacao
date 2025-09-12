import { applyUrlDefaults, queryParams, type RouteDefinition, type RouteFormDefinition, type RouteQueryOptions } from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\RequisicaoController::index
 * @see app/Http/Controllers/RequisicaoController.php:22
 * @route '/requisicoes'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/requisicoes',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\RequisicaoController::index
 * @see app/Http/Controllers/RequisicaoController.php:22
 * @route '/requisicoes'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\RequisicaoController::index
 * @see app/Http/Controllers/RequisicaoController.php:22
 * @route '/requisicoes'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::index
 * @see app/Http/Controllers/RequisicaoController.php:22
 * @route '/requisicoes'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::index
 * @see app/Http/Controllers/RequisicaoController.php:22
 * @route '/requisicoes'
 */
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::index
 * @see app/Http/Controllers/RequisicaoController.php:22
 * @route '/requisicoes'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::index
 * @see app/Http/Controllers/RequisicaoController.php:22
 * @route '/requisicoes'
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
 * @see \App\Http\Controllers\RequisicaoController::create
 * @see app/Http/Controllers/RequisicaoController.php:126
 * @route '/requisicoes/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

create.definition = {
    methods: ['get', 'head'],
    url: '/requisicoes/create',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\RequisicaoController::create
 * @see app/Http/Controllers/RequisicaoController.php:126
 * @route '/requisicoes/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\RequisicaoController::create
 * @see app/Http/Controllers/RequisicaoController.php:126
 * @route '/requisicoes/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::create
 * @see app/Http/Controllers/RequisicaoController.php:126
 * @route '/requisicoes/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::create
 * @see app/Http/Controllers/RequisicaoController.php:126
 * @route '/requisicoes/create'
 */
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::create
 * @see app/Http/Controllers/RequisicaoController.php:126
 * @route '/requisicoes/create'
 */
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::create
 * @see app/Http/Controllers/RequisicaoController.php:126
 * @route '/requisicoes/create'
 */
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

create.form = createForm;

/**
 * @see \App\Http\Controllers\RequisicaoController::store
 * @see app/Http/Controllers/RequisicaoController.php:141
 * @route '/requisicoes'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/requisicoes',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\RequisicaoController::store
 * @see app/Http/Controllers/RequisicaoController.php:141
 * @route '/requisicoes'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\RequisicaoController::store
 * @see app/Http/Controllers/RequisicaoController.php:141
 * @route '/requisicoes'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::store
 * @see app/Http/Controllers/RequisicaoController.php:141
 * @route '/requisicoes'
 */
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::store
 * @see app/Http/Controllers/RequisicaoController.php:141
 * @route '/requisicoes'
 */
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;

/**
 * @see \App\Http\Controllers\RequisicaoController::show
 * @see app/Http/Controllers/RequisicaoController.php:179
 * @route '/requisicoes/{requisicao}'
 */
export const show = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/requisicoes/{requisicao}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\RequisicaoController::show
 * @see app/Http/Controllers/RequisicaoController.php:179
 * @route '/requisicoes/{requisicao}'
 */
show.url = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { requisicao: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { requisicao: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            requisicao: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        requisicao: typeof args.requisicao === 'object' ? args.requisicao.id : args.requisicao,
    };

    return show.definition.url.replace('{requisicao}', parsedArgs.requisicao.toString()).replace(/\/+$/, '') + queryParams(options);
};

/**
 * @see \App\Http\Controllers\RequisicaoController::show
 * @see app/Http/Controllers/RequisicaoController.php:179
 * @route '/requisicoes/{requisicao}'
 */
show.get = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::show
 * @see app/Http/Controllers/RequisicaoController.php:179
 * @route '/requisicoes/{requisicao}'
 */
show.head = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::show
 * @see app/Http/Controllers/RequisicaoController.php:179
 * @route '/requisicoes/{requisicao}'
 */
const showForm = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::show
 * @see app/Http/Controllers/RequisicaoController.php:179
 * @route '/requisicoes/{requisicao}'
 */
showForm.get = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::show
 * @see app/Http/Controllers/RequisicaoController.php:179
 * @route '/requisicoes/{requisicao}'
 */
showForm.head = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

show.form = showForm;

/**
 * @see \App\Http\Controllers\RequisicaoController::edit
 * @see app/Http/Controllers/RequisicaoController.php:265
 * @route '/requisicoes/{requisicao}/edit'
 */
export const edit = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

edit.definition = {
    methods: ['get', 'head'],
    url: '/requisicoes/{requisicao}/edit',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\RequisicaoController::edit
 * @see app/Http/Controllers/RequisicaoController.php:265
 * @route '/requisicoes/{requisicao}/edit'
 */
edit.url = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { requisicao: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { requisicao: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            requisicao: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        requisicao: typeof args.requisicao === 'object' ? args.requisicao.id : args.requisicao,
    };

    return edit.definition.url.replace('{requisicao}', parsedArgs.requisicao.toString()).replace(/\/+$/, '') + queryParams(options);
};

/**
 * @see \App\Http\Controllers\RequisicaoController::edit
 * @see app/Http/Controllers/RequisicaoController.php:265
 * @route '/requisicoes/{requisicao}/edit'
 */
edit.get = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::edit
 * @see app/Http/Controllers/RequisicaoController.php:265
 * @route '/requisicoes/{requisicao}/edit'
 */
edit.head = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::edit
 * @see app/Http/Controllers/RequisicaoController.php:265
 * @route '/requisicoes/{requisicao}/edit'
 */
const editForm = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::edit
 * @see app/Http/Controllers/RequisicaoController.php:265
 * @route '/requisicoes/{requisicao}/edit'
 */
editForm.get = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::edit
 * @see app/Http/Controllers/RequisicaoController.php:265
 * @route '/requisicoes/{requisicao}/edit'
 */
editForm.head = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

edit.form = editForm;

/**
 * @see \App\Http\Controllers\RequisicaoController::update
 * @see app/Http/Controllers/RequisicaoController.php:296
 * @route '/requisicoes/{requisicao}'
 */
export const update = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

update.definition = {
    methods: ['put', 'patch'],
    url: '/requisicoes/{requisicao}',
} satisfies RouteDefinition<['put', 'patch']>;

/**
 * @see \App\Http\Controllers\RequisicaoController::update
 * @see app/Http/Controllers/RequisicaoController.php:296
 * @route '/requisicoes/{requisicao}'
 */
update.url = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { requisicao: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { requisicao: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            requisicao: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        requisicao: typeof args.requisicao === 'object' ? args.requisicao.id : args.requisicao,
    };

    return update.definition.url.replace('{requisicao}', parsedArgs.requisicao.toString()).replace(/\/+$/, '') + queryParams(options);
};

/**
 * @see \App\Http\Controllers\RequisicaoController::update
 * @see app/Http/Controllers/RequisicaoController.php:296
 * @route '/requisicoes/{requisicao}'
 */
update.put = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::update
 * @see app/Http/Controllers/RequisicaoController.php:296
 * @route '/requisicoes/{requisicao}'
 */
update.patch = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::update
 * @see app/Http/Controllers/RequisicaoController.php:296
 * @route '/requisicoes/{requisicao}'
 */
const updateForm = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::update
 * @see app/Http/Controllers/RequisicaoController.php:296
 * @route '/requisicoes/{requisicao}'
 */
updateForm.put = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::update
 * @see app/Http/Controllers/RequisicaoController.php:296
 * @route '/requisicoes/{requisicao}'
 */
updateForm.patch = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

update.form = updateForm;

/**
 * @see \App\Http\Controllers\RequisicaoController::destroy
 * @see app/Http/Controllers/RequisicaoController.php:361
 * @route '/requisicoes/{requisicao}'
 */
export const destroy = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/requisicoes/{requisicao}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\RequisicaoController::destroy
 * @see app/Http/Controllers/RequisicaoController.php:361
 * @route '/requisicoes/{requisicao}'
 */
destroy.url = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { requisicao: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { requisicao: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            requisicao: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        requisicao: typeof args.requisicao === 'object' ? args.requisicao.id : args.requisicao,
    };

    return destroy.definition.url.replace('{requisicao}', parsedArgs.requisicao.toString()).replace(/\/+$/, '') + queryParams(options);
};

/**
 * @see \App\Http\Controllers\RequisicaoController::destroy
 * @see app/Http/Controllers/RequisicaoController.php:361
 * @route '/requisicoes/{requisicao}'
 */
destroy.delete = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::destroy
 * @see app/Http/Controllers/RequisicaoController.php:361
 * @route '/requisicoes/{requisicao}'
 */
const destroyForm = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::destroy
 * @see app/Http/Controllers/RequisicaoController.php:361
 * @route '/requisicoes/{requisicao}'
 */
destroyForm.delete = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

destroy.form = destroyForm;

/**
 * @see \App\Http\Controllers\RequisicaoController::excluidas
 * @see app/Http/Controllers/RequisicaoController.php:401
 * @route '/requisicoes-excluidas'
 */
export const excluidas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: excluidas.url(options),
    method: 'get',
});

excluidas.definition = {
    methods: ['get', 'head'],
    url: '/requisicoes-excluidas',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\RequisicaoController::excluidas
 * @see app/Http/Controllers/RequisicaoController.php:401
 * @route '/requisicoes-excluidas'
 */
excluidas.url = (options?: RouteQueryOptions) => {
    return excluidas.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\RequisicaoController::excluidas
 * @see app/Http/Controllers/RequisicaoController.php:401
 * @route '/requisicoes-excluidas'
 */
excluidas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: excluidas.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::excluidas
 * @see app/Http/Controllers/RequisicaoController.php:401
 * @route '/requisicoes-excluidas'
 */
excluidas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: excluidas.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::excluidas
 * @see app/Http/Controllers/RequisicaoController.php:401
 * @route '/requisicoes-excluidas'
 */
const excluidasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: excluidas.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::excluidas
 * @see app/Http/Controllers/RequisicaoController.php:401
 * @route '/requisicoes-excluidas'
 */
excluidasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: excluidas.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::excluidas
 * @see app/Http/Controllers/RequisicaoController.php:401
 * @route '/requisicoes-excluidas'
 */
excluidasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: excluidas.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

excluidas.form = excluidasForm;

/**
 * @see \App\Http\Controllers\RequisicaoController::exportMethod
 * @see app/Http/Controllers/RequisicaoController.php:480
 * @route '/requisicoes-export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
});

exportMethod.definition = {
    methods: ['get', 'head'],
    url: '/requisicoes-export',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\RequisicaoController::exportMethod
 * @see app/Http/Controllers/RequisicaoController.php:480
 * @route '/requisicoes-export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\RequisicaoController::exportMethod
 * @see app/Http/Controllers/RequisicaoController.php:480
 * @route '/requisicoes-export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::exportMethod
 * @see app/Http/Controllers/RequisicaoController.php:480
 * @route '/requisicoes-export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::exportMethod
 * @see app/Http/Controllers/RequisicaoController.php:480
 * @route '/requisicoes-export'
 */
const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::exportMethod
 * @see app/Http/Controllers/RequisicaoController.php:480
 * @route '/requisicoes-export'
 */
exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::exportMethod
 * @see app/Http/Controllers/RequisicaoController.php:480
 * @route '/requisicoes-export'
 */
exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

exportMethod.form = exportMethodForm;

/**
 * @see \App\Http\Controllers\RequisicaoController::anexo
 * @see app/Http/Controllers/RequisicaoController.php:460
 * @route '/requisicoes/{requisicao}/anexo'
 */
export const anexo = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: anexo.url(args, options),
    method: 'get',
});

anexo.definition = {
    methods: ['get', 'head'],
    url: '/requisicoes/{requisicao}/anexo',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\RequisicaoController::anexo
 * @see app/Http/Controllers/RequisicaoController.php:460
 * @route '/requisicoes/{requisicao}/anexo'
 */
anexo.url = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { requisicao: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { requisicao: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            requisicao: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        requisicao: typeof args.requisicao === 'object' ? args.requisicao.id : args.requisicao,
    };

    return anexo.definition.url.replace('{requisicao}', parsedArgs.requisicao.toString()).replace(/\/+$/, '') + queryParams(options);
};

/**
 * @see \App\Http\Controllers\RequisicaoController::anexo
 * @see app/Http/Controllers/RequisicaoController.php:460
 * @route '/requisicoes/{requisicao}/anexo'
 */
anexo.get = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: anexo.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::anexo
 * @see app/Http/Controllers/RequisicaoController.php:460
 * @route '/requisicoes/{requisicao}/anexo'
 */
anexo.head = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: anexo.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::anexo
 * @see app/Http/Controllers/RequisicaoController.php:460
 * @route '/requisicoes/{requisicao}/anexo'
 */
const anexoForm = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: anexo.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::anexo
 * @see app/Http/Controllers/RequisicaoController.php:460
 * @route '/requisicoes/{requisicao}/anexo'
 */
anexoForm.get = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: anexo.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::anexo
 * @see app/Http/Controllers/RequisicaoController.php:460
 * @route '/requisicoes/{requisicao}/anexo'
 */
anexoForm.head = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: anexo.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

anexo.form = anexoForm;

/**
 * @see \App\Http\Controllers\RequisicaoController::concretizar
 * @see app/Http/Controllers/RequisicaoController.php:339
 * @route '/requisicoes/{requisicao}/concretizar'
 */
export const concretizar = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: concretizar.url(args, options),
    method: 'post',
});

concretizar.definition = {
    methods: ['post'],
    url: '/requisicoes/{requisicao}/concretizar',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\RequisicaoController::concretizar
 * @see app/Http/Controllers/RequisicaoController.php:339
 * @route '/requisicoes/{requisicao}/concretizar'
 */
concretizar.url = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { requisicao: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { requisicao: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            requisicao: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        requisicao: typeof args.requisicao === 'object' ? args.requisicao.id : args.requisicao,
    };

    return concretizar.definition.url.replace('{requisicao}', parsedArgs.requisicao.toString()).replace(/\/+$/, '') + queryParams(options);
};

/**
 * @see \App\Http\Controllers\RequisicaoController::concretizar
 * @see app/Http/Controllers/RequisicaoController.php:339
 * @route '/requisicoes/{requisicao}/concretizar'
 */
concretizar.post = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: concretizar.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::concretizar
 * @see app/Http/Controllers/RequisicaoController.php:339
 * @route '/requisicoes/{requisicao}/concretizar'
 */
const concretizarForm = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: concretizar.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::concretizar
 * @see app/Http/Controllers/RequisicaoController.php:339
 * @route '/requisicoes/{requisicao}/concretizar'
 */
concretizarForm.post = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: concretizar.url(args, options),
    method: 'post',
});

concretizar.form = concretizarForm;

/**
 * @see \App\Http\Controllers\RequisicaoController::cancelar
 * @see app/Http/Controllers/RequisicaoController.php:381
 * @route '/requisicoes/{requisicao}/cancelar'
 */
export const cancelar = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: cancelar.url(args, options),
    method: 'post',
});

cancelar.definition = {
    methods: ['post'],
    url: '/requisicoes/{requisicao}/cancelar',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\RequisicaoController::cancelar
 * @see app/Http/Controllers/RequisicaoController.php:381
 * @route '/requisicoes/{requisicao}/cancelar'
 */
cancelar.url = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { requisicao: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { requisicao: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            requisicao: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        requisicao: typeof args.requisicao === 'object' ? args.requisicao.id : args.requisicao,
    };

    return cancelar.definition.url.replace('{requisicao}', parsedArgs.requisicao.toString()).replace(/\/+$/, '') + queryParams(options);
};

/**
 * @see \App\Http\Controllers\RequisicaoController::cancelar
 * @see app/Http/Controllers/RequisicaoController.php:381
 * @route '/requisicoes/{requisicao}/cancelar'
 */
cancelar.post = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: cancelar.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::cancelar
 * @see app/Http/Controllers/RequisicaoController.php:381
 * @route '/requisicoes/{requisicao}/cancelar'
 */
const cancelarForm = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: cancelar.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::cancelar
 * @see app/Http/Controllers/RequisicaoController.php:381
 * @route '/requisicoes/{requisicao}/cancelar'
 */
cancelarForm.post = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: cancelar.url(args, options),
    method: 'post',
});

cancelar.form = cancelarForm;

/**
 * @see \App\Http\Controllers\RequisicaoController::pdf
 * @see app/Http/Controllers/RequisicaoController.php:446
 * @route '/requisicoes/{requisicao}/pdf'
 */
export const pdf = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
});

pdf.definition = {
    methods: ['get', 'head'],
    url: '/requisicoes/{requisicao}/pdf',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\RequisicaoController::pdf
 * @see app/Http/Controllers/RequisicaoController.php:446
 * @route '/requisicoes/{requisicao}/pdf'
 */
pdf.url = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { requisicao: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { requisicao: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            requisicao: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        requisicao: typeof args.requisicao === 'object' ? args.requisicao.id : args.requisicao,
    };

    return pdf.definition.url.replace('{requisicao}', parsedArgs.requisicao.toString()).replace(/\/+$/, '') + queryParams(options);
};

/**
 * @see \App\Http\Controllers\RequisicaoController::pdf
 * @see app/Http/Controllers/RequisicaoController.php:446
 * @route '/requisicoes/{requisicao}/pdf'
 */
pdf.get = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::pdf
 * @see app/Http/Controllers/RequisicaoController.php:446
 * @route '/requisicoes/{requisicao}/pdf'
 */
pdf.head = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: pdf.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::pdf
 * @see app/Http/Controllers/RequisicaoController.php:446
 * @route '/requisicoes/{requisicao}/pdf'
 */
const pdfForm = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: pdf.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::pdf
 * @see app/Http/Controllers/RequisicaoController.php:446
 * @route '/requisicoes/{requisicao}/pdf'
 */
pdfForm.get = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: pdf.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\RequisicaoController::pdf
 * @see app/Http/Controllers/RequisicaoController.php:446
 * @route '/requisicoes/{requisicao}/pdf'
 */
pdfForm.head = (
    args: { requisicao: number | { id: number } } | [requisicao: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: pdf.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

pdf.form = pdfForm;

const RequisicaoController = {
    index,
    create,
    store,
    show,
    edit,
    update,
    destroy,
    excluidas,
    exportMethod,
    anexo,
    concretizar,
    cancelar,
    pdf,
    export: exportMethod,
};

export default RequisicaoController;
