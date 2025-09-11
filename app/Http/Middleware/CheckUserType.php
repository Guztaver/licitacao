<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckUserType
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$allowedTypes
     */
    public function handle(Request $request, Closure $next, ...$allowedTypes)
    {
        if (! Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();

        // If no user type is set, default to 'operacional'
        $userType = $user->tipo_acesso ?? 'operacional';

        // Check if user type is allowed
        if (! empty($allowedTypes) && ! in_array($userType, $allowedTypes)) {
            abort(403, 'Acesso negado. Você não tem permissão para acessar esta área.');
        }

        return $next($request);
    }
}
