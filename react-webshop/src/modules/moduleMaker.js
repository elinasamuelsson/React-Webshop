import InventoryModule from "./Elina/index.js";
import ShippingModule from "./alex/index.js";

export default {
	InventoryModule: new InventoryModule(),
	InventoryModuleDescriptor: InventoryModule.descriptor,
	ShippingModule: new ShippingModule(),
	ShippingModuleDescriptor: ShippingModule.descriptor,
};
