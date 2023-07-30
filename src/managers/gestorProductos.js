import fs from "fs"

export default class ProductManager {
    constructor(patch) {
        this.patch = patch;
    }

    agregarProducto = async (product) => {
        try {
            const products = await this.obtenerProductos();
            const codigoRepetido = products.find((p) => p.codigo === product.codigo);

            if (
                !product.titulo ||
                !product.descripcion ||
                !product.precio ||
                !product.imagen ||
                !product.codigo ||
                !product.existencias
            ) {
                return "Complete todos los campos";
            }
            if (codigoRepetido) {
                return "El codigo insertado ya existe";
            }
            let id;
            if (products.length === 0) {
                id = 1;
            } else {
                id = products[products.length - 1].id + 1;
            }

            products.push({ ...product, id });

            await fs.promises.writeFile(
                this.patch,
                JSON.stringify(products, null, "\t")
            );
        }
        catch (error) {
            console.log(error);
        }
    };

    leerProductos = async () => {
        let resultado = await fs.promises.readFile(this.patch, "utf-8")
        return JSON.parse(resultado)
    }

    obtenerProductos = async () => {
        try {
            if (fs.existsSync(this.patch)) {
                const resultado2 = await this.leerProductos();
                console.log(resultado2);
                return resultado2;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    };

    obtenerProductosPorId = async (id) => {
        try {
            let todosProductos = await this.leerProductos();
            let idProducto = todosProductos.find((productos) => productos.id === id);
            if (idProducto) {
                console.log(idProducto);
                return idProducto;                
            }else{
                console.log("No existe el producto");
                return "No Existe el producto";
            }
        } catch (error) {
            console.log(error);
        }
    };

    actualizarProducto = async (product) => {
        try {
            const products = await this.leerProductos();
            const productoBuscado = products.find((productos) => productos.id === product.id);
            if (!productoBuscado) {
                return `No se puede encontrar el producto con el id : ${product.id}`;
            }
            const indexOfProduct = products.findIndex((p) => p.id === product.id);
            products[indexOfProduct] = {
                ...productoBuscado,
                ...product,
            };
            await fs.promises.writeFile(this.patch, JSON.stringify(products), "utf8");
            return products[indexOfProduct];
        } catch (error) {
            console.log(error);
        }
    };

    eliminarProductosPorId = async (id) => {
        try {
            const products = await this.leerProductos()
            const index = products.findIndex((p) => p.id === id);

            if (index < 0) {
                return `No se encuentra el producto con el id: ${id}`;
            }
            products.splice(index, 1);

            await fs.promises.writeFile(
                this.path,
                JSON.stringify(products, null, "\t")
            );
            return products;
        } catch (error) {
            console.log(error);
        }
    };
}


