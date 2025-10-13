import DashboardController from './DashboardController'
import RelatorioController from './RelatorioController'
import ProfileController from './ProfileController'
import FornecedorController from './FornecedorController'
import ProcessoLicitatorioController from './ProcessoLicitatorioController'
import ContratoController from './ContratoController'
import CategoriaMaterialController from './CategoriaMaterialController'
import DispensaLicitacaoController from './DispensaLicitacaoController'
import ItemController from './ItemController'
import EmitenteController from './EmitenteController'
import DestinatarioController from './DestinatarioController'
import PedidoCompraController from './PedidoCompraController'
import RequisicaoController from './RequisicaoController'
import ConferenciaController from './ConferenciaController'
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
    ItemController: Object.assign(ItemController, ItemController),
    EmitenteController: Object.assign(EmitenteController, EmitenteController),
    DestinatarioController: Object.assign(DestinatarioController, DestinatarioController),
    PedidoCompraController: Object.assign(PedidoCompraController, PedidoCompraController),
    RequisicaoController: Object.assign(RequisicaoController, RequisicaoController),
    ConferenciaController: Object.assign(ConferenciaController, ConferenciaController),
    LimiteDispensaAlertaController: Object.assign(LimiteDispensaAlertaController, LimiteDispensaAlertaController),
    Auth: Object.assign(Auth, Auth),
}

export default Controllers