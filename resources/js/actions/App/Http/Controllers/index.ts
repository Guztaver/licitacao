import DashboardController from './DashboardController'
import FornecedorController from './FornecedorController'
import RequisicaoController from './RequisicaoController'
import ConferenciaController from './ConferenciaController'
import ProcessoLicitatorioController from './ProcessoLicitatorioController'
import ContratoController from './ContratoController'
import PedidoCompraController from './PedidoCompraController'
import EmitenteController from './EmitenteController'
import DestinatarioController from './DestinatarioController'
import ItemController from './ItemController'
import CategoriaMaterialController from './CategoriaMaterialController'
import RelatorioController from './RelatorioController'
import Settings from './Settings'
import Auth from './Auth'

const Controllers = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    FornecedorController: Object.assign(FornecedorController, FornecedorController),
    RequisicaoController: Object.assign(RequisicaoController, RequisicaoController),
    ConferenciaController: Object.assign(ConferenciaController, ConferenciaController),
    ProcessoLicitatorioController: Object.assign(ProcessoLicitatorioController, ProcessoLicitatorioController),
    ContratoController: Object.assign(ContratoController, ContratoController),
    PedidoCompraController: Object.assign(PedidoCompraController, PedidoCompraController),
    EmitenteController: Object.assign(EmitenteController, EmitenteController),
    DestinatarioController: Object.assign(DestinatarioController, DestinatarioController),
    ItemController: Object.assign(ItemController, ItemController),
    CategoriaMaterialController: Object.assign(CategoriaMaterialController, CategoriaMaterialController),
    RelatorioController: Object.assign(RelatorioController, RelatorioController),
    Settings: Object.assign(Settings, Settings),
    Auth: Object.assign(Auth, Auth),
}

export default Controllers