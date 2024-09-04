import route from "./allRoutes.js"

const MainRoutes = (app) =>{
app.use('/api', route)
}

export default MainRoutes