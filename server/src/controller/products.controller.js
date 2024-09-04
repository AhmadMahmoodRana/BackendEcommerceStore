const getProduct = async (req,res) =>{
res.json({
    id: 1,
    name: 'Product 1',
    description: 'This is Product 1',
    price: 100,
    quantity: 100,
    image: 'image1.jpg'
})
}
export default getProduct;