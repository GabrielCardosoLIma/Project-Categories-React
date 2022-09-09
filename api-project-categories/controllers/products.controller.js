const Products = require('../models/Products')
const Categories = require('../models/Categories')

exports.findAll = async (req, res) => {
    await Products.findAll({
        atributes: ['id', 'name', 'description'],
        order: [['name', 'ASC']],
        include: [Categories]
    })
    .then((Products) => {
        return res.json({
            erro: false,
            Products
    });
    }).catch((err) => {
        return res.status(404).json({
            erro: true,
            mensagem: `Erro: ${err} ou Nenhum Produto encontrado!!!`
        })
    })
}

exports.findOne = async (req, res) => {
    const { id } = req.params;
    try{
        // const Product = await Products.findByPk(id);
        const Product = await Products.findByPk(id, {
            include:[Categories]
        });
        if(!Product){
            return res.status(400).json({
                erro: true,
                mensagem: 'Erro Produto não encontrado!'
            })
        }
        res.status(200).json({
            erro: false,
            Product
        })
    }catch(err) {
        res.status(404).json({
            erro: true,
            mensagem: `Erro: ${err}`
        })
    }
}

exports.create = async (req, res) => {
    var dados = req.body;
    await Products.create(dados)
    .then(() =>{

        return res.json({
            erro: false,
            mensgem: 'Produto cadastrado com sucesso!'
        });
    }).catch(err => {
        return res.status(400).json({
            erro: true,
            mensgem: `Erro: Produto não cadastrado...${err}`
        })
    })
}

exports.update = async (req, res) => {
    const { id } = req.body;
    await Products.update(req.body, {where: {id}})
    .then(() => {
        return res.json({
            erro: false,
            mensagem: 'Produto alterado com sucesso!'
        })
    }).catch((err) =>{
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: Produto não alterado ...${err}`
        })
    })
}

exports.delete = async (req, res) => {
    const { id } = req.params;
    await Products.destroy({where: {id}})
    .then(() => {
        return res.json({
            erro: false,
            mensagem: 'Produto apagado com sucesso!!!'
        })
    }).catch((err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} Produto não apagado...`
        })
    })
}

exports.findAllPages = async (req, res) => {
    console.log(req.params);

    const {page=1} = req.params;
    const limit = 2;
    let lastPage = 1;

    const countProducts = await Products.count()
    console.log(countProducts)

    if(countProducts === null) {
        return res.status(400).json({
            erro: true,
            mensagem: "Error: Products não encontrada!!!"
        })
    } else {
        lastPage = Math.ceil(countProducts / limit);
        console.log(lastPage);
    }
    // Select id, name, description from Products Limit 2 offset 3
    // Exemplo:
    // pag 1 = 1,2
    // pag 2 = 3,4
    // pag 3 = 5,6

    await Products.findAll({
        attributes: ['id','name', 'description', 'quantity', 'price', 'categorieId'],
        order:[['id','ASC']],
        offset: Number((page * limit) - limit), // pag 3 * 2 = 6
        limit: limit
    })
    .then( (products) => {
        return res.json({
            erro:false,
            products,
            countProducts,
            lastPage
        });
    }).catch( (err) => {
        return res.status(400).json({
            erro: true,
            mensagem:`Erro: ${err} ou Nehum Categoria encontrado!!!`
        });
    });
};