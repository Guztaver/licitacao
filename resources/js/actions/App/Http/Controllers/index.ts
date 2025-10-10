import DashboardController from './DashboardController'
import FornecedorController from './FornecedorController'
import RequisicaoController from './RequisicaoController'
import ConferenciaController from './ConferenciaController'
import ContratoController from './ContratoController'
import EmitenteController from './EmitenteController'
import DestinatarioController from './DestinatarioController'
import ItemController from './ItemController'
import RelatorioController from './RelatorioController'
import Settings from './Settings'
import Auth from './Auth'

const Controllers = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    FornecedorController: Object.assign(FornecedorController, FornecedorController),
    RequisicaoController: Object.assign(RequisicaoController, RequisicaoController),
    ConferenciaController: Object.assign(ConferenciaController, ConferenciaController),
    ContratoController: Object.assign(ContratoController, ContratoController),
    EmitenteController: Object.assign(EmitenteController, EmitenteController),
    DestinatarioController: Object.assign(DestinatarioController, DestinatarioController),
    ItemController: Object.assign(ItemController, ItemController),
    RelatorioController: Object.assign(RelatorioController, RelatorioController),
    Settings: Object.assign(Settings, Settings),
    Auth: Object.assign(Auth, Auth),
}

export default Controllers