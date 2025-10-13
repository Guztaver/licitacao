import DashboardController from './DashboardController'
import RelatorioController from './RelatorioController'
import ProfileController from './ProfileController'
import FornecedorController from './FornecedorController'
import ProcessoLicitatorioController from './ProcessoLicitatorioController'
import ContratoController from './ContratoController'
import CategoriaMaterialController from './CategoriaMaterialController'
import DispensaLicitacaoController from './DispensaLicitacaoController'
import LimiteDispensaAlertaController from './LimiteDispensaAlertaController'
import Auth from './Auth'

const Controllers = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    RelatorioController: Object.assign(RelatorioController, RelatorioController),
    ProfileController: Object.assign(ProfileController, ProfileController),
    FornecedorController: Object.assign(FornecedorController, FornecedorController),
    ProcessoLicitatorioController: Object.assign(ProcessoLicitatorioController, ProcessoLicitatorioController),
    ContratoController: Object.assign(ContratoController, ContratoController),
    CategoriaMaterialController: Object.assign(CategoriaMaterialController, CategoriaMaterialController),
    DispensaLicitacaoController: Object.assign(DispensaLicitacaoController, DispensaLicitacaoController),
    LimiteDispensaAlertaController: Object.assign(LimiteDispensaAlertaController, LimiteDispensaAlertaController),
    Auth: Object.assign(Auth, Auth),
}

export default Controllers