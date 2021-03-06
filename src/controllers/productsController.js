const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render('products', {
			products,
			toThousand
		});
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let id = req.params.id;
		let product = products.find(product => product.id == id);
		res.render('detail', {
			product,
			toThousand
		});
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form');
	},
	
	// Create -  Method to store
	store: (req, res) => {
		let upImage; 
		if(req.file){
			upImage = req.file.filename;
		}else{
			upImage = 'default-image.png';
		}
		let newProduct = {
			...req.body,
			image: upImage,
			id: products[products.length - 1].id + 1
		};
		products.push(newProduct);
		fs.writeFileSync(productsFilePath, JSON.stringify(products, null, ' '));
		res.redirect('/products');
	},

	// Update - Form to edit
	edit: (req, res) => {
		let id = req.params.id;
		let productToEdit = products.find(product => product.id == id);
		res.render('product-edit-form', {productToEdit});
	},
	// Update - Method to update
	update: (req, res) => {
		let id = req.params.id;
		let productToEdit = products.find(product => product.id == id);

		productToEdit = {
			id: productToEdit.id,
			...req.body,
			image: productToEdit.image,
		};

		let newProducts = products.map(product =>{
			if(product.id == productToEdit.id){
				return product = {...productToEdit}
			}
			return product
		});

		fs.writeFileSync(productsFilePath, JSON.stringify(newProducts, null, ' '));
		res.redirect('/products');
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		let id = req.params.id;
		const productToDelete = products.findIndex(producto => id == producto.id);
		if(productToDelete >= 0){
			products.splice(productToDelete, 1);
			fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf-8')
			res.redirect('/products');
		}
		else{
			res.redirect('/products');
		}
		/* let finalProducts = products.filter(product => product.id != id);
		fs.writeFileSync(productsFilePath, JSON.stringify(finalProducts, null, ' '));
		res.redirect('/'); */
	}
};

module.exports = controller;