import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Building2, CheckCircle, FileText, Lock, Shield, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard, login, register } from '@/routes';
import type { SharedData } from '@/types';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const features = [
        {
            icon: <Building2 className="h-8 w-8 text-blue-600" />,
            title: 'Gestão de Fornecedores',
            description: 'Cadastro completo com validação de CNPJ, endereços e informações de contato para todos os seus fornecedores.',
        },
        {
            icon: <FileText className="h-8 w-8 text-green-600" />,
            title: 'Controle de Requisições',
            description: 'Gerencie todo o ciclo de vida das requisições de compra desde a criação até a concretização.',
        },
        {
            icon: <CheckCircle className="h-8 w-8 text-purple-600" />,
            title: 'Conferências e Auditoria',
            description: 'Sistema de auditoria robusto para validação de transações e garantia de conformidade.',
        },
        {
            icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
            title: 'Relatórios Gerenciais',
            description: 'Dashboards interativos e relatórios detalhados para análise e tomada de decisão estratégica.',
        },
        {
            icon: <Users className="h-8 w-8 text-indigo-600" />,
            title: 'Gestão de Usuários',
            description: 'Sistema completo de autenticação com diferentes níveis de acesso e permissões granulares.',
        },
        {
            icon: <Shield className="h-8 w-8 text-red-600" />,
            title: 'Segurança Avançada',
            description: 'Logs de auditoria, proteção CSRF, validação rigorosa e conformidade com melhores práticas.',
        },
    ];

    const stats = [
        { label: 'Processos Otimizados', value: '100%' },
        { label: 'Transparência', value: 'Total' },
        { label: 'Conformidade', value: 'Garantida' },
        { label: 'Eficiência', value: 'Máxima' },
    ];

    return (
        <>
            <Head title="Sistema de Licitações - Modernize seus processos de compra pública">
                <meta
                    name="description"
                    content="Sistema completo para gerenciamento de licitações e processos de compras públicas. Desenvolvido especificamente para o contexto brasileiro."
                />
                <meta name="keywords" content="licitação, compras públicas, sistema, fornecedores, requisições, auditoria, Brasil" />
            </Head>

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
                {/* Header */}
                <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-900/95 dark:supports-[backdrop-filter]:bg-slate-900/60">
                    <div className="container mx-auto flex h-16 items-center justify-between px-4">
                        <div className="flex items-center space-x-2">
                            <FileText className="h-8 w-8 text-blue-600" />
                            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">Sistema de Licitações</span>
                        </div>
                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <Button asChild>
                                    <Link href={dashboard()}>
                                        Dashboard
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" asChild>
                                        <Link href={login()}>Entrar</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={register()}>Cadastrar</Link>
                                    </Button>
                                </div>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="py-20 lg:py-32">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-4xl text-center">
                            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 lg:text-6xl dark:text-slate-100">
                                Modernize seus processos de{' '}
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">licitação pública</span>
                            </h1>
                            <p className="mb-8 text-xl text-slate-600 lg:text-2xl dark:text-slate-300">
                                Um sistema completo para gerenciamento de fornecedores, requisições de compra e processos de auditoria. Desenvolvido
                                especificamente para o contexto brasileiro com foco em transparência e eficiência.
                            </p>
                            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                {auth.user ? (
                                    <Button size="lg" asChild className="px-8 py-3 text-lg">
                                        <Link href={dashboard()}>
                                            Acessar Dashboard
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button size="lg" asChild className="px-8 py-3 text-lg">
                                            <Link href={register()}>
                                                Começar Agora
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </Link>
                                        </Button>
                                        <Button size="lg" variant="outline" asChild className="px-8 py-3 text-lg">
                                            <Link href={login()}>Fazer Login</Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="bg-slate-100 py-16 dark:bg-slate-800">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                            {stats.map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <div className="text-3xl font-bold text-blue-600 lg:text-4xl">{stat.value}</div>
                                    <div className="text-slate-600 dark:text-slate-300">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl dark:text-slate-100">Funcionalidades Completas</h2>
                            <p className="mb-12 text-lg text-slate-600 dark:text-slate-300">
                                Tudo que você precisa para gerenciar processos licitatórios de forma eficiente e transparente
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature) => (
                                <Card key={feature.title} className="transition-shadow duration-200 hover:shadow-lg">
                                    <CardHeader>
                                        <div className="mb-4">{feature.icon}</div>
                                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base">{feature.description}</CardDescription>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Technology Section */}
                <section className="bg-slate-50 py-20 dark:bg-slate-900">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl dark:text-slate-100">Tecnologia Moderna</h2>
                            <p className="mb-12 text-lg text-slate-600 dark:text-slate-300">
                                Construído com as melhores tecnologias para garantir performance, segurança e escalabilidade
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <Lock className="h-6 w-6 text-green-600" />
                                        Backend Robusto
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                                        <li>• Laravel 12 - Framework PHP moderno</li>
                                        <li>• PHP 8.4+ - Linguagem com recursos avançados</li>
                                        <li>• MySQL/SQLite - Banco de dados confiável</li>
                                        <li>• API REST - Integração com sistemas externos</li>
                                    </ul>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <TrendingUp className="h-6 w-6 text-blue-600" />
                                        Frontend Moderno
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                                        <li>• React 19 - Interface de usuário reativa</li>
                                        <li>• TypeScript - Tipagem estática</li>
                                        <li>• Inertia.js - SPA sem API complexa</li>
                                        <li>• Tailwind CSS - Design system moderno</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">Pronto para modernizar seus processos?</h2>
                        <p className="mb-8 text-xl text-blue-100">Junte-se a organizações que já transformaram seus processos licitatórios</p>
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            {auth.user ? (
                                <Button size="lg" variant="secondary" asChild className="px-8 py-3 text-lg">
                                    <Link href={dashboard()}>
                                        Acessar Sistema
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button size="lg" variant="secondary" asChild className="px-8 py-3 text-lg">
                                        <Link href={register()}>
                                            Criar Conta Gratuita
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        asChild
                                        className="border-white px-8 py-3 text-lg text-white hover:bg-white hover:text-blue-600"
                                    >
                                        <Link href={login()}>Já tenho conta</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-slate-900 py-12 text-white">
                    <div className="container mx-auto px-4">
                        <div className="grid gap-8 md:grid-cols-3">
                            <div>
                                <div className="mb-4 flex items-center space-x-2">
                                    <FileText className="h-6 w-6 text-blue-400" />
                                    <span className="text-lg font-bold">Sistema de Licitações</span>
                                </div>
                                <p className="text-slate-400">Modernizando processos de compra pública com tecnologia brasileira.</p>
                            </div>
                            <div>
                                <h3 className="mb-4 text-lg font-semibold">Recursos</h3>
                                <ul className="space-y-2 text-slate-400">
                                    <li>Gestão de Fornecedores</li>
                                    <li>Controle de Requisições</li>
                                    <li>Sistema de Auditoria</li>
                                    <li>Relatórios Gerenciais</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="mb-4 text-lg font-semibold">Tecnologia</h3>
                                <ul className="space-y-2 text-slate-400">
                                    <li>Laravel 12</li>
                                    <li>React 19</li>
                                    <li>TypeScript</li>
                                    <li>Inertia.js</li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8 border-t border-slate-800 pt-8 text-center text-slate-400">
                            <p>
                                &copy; 2025 Sistema de Licitações. Desenvolvido com ❤️ por{' '}
                                <a href="https://github.com/guztaver" className="text-gray-100">
                                    Guztaver
                                </a>{' '}
                                para o Brasil.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
