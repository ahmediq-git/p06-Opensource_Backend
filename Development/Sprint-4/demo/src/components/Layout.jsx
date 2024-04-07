import Navbar from './Navbar'

const layout = (Component) => {
    return function Layout(props) {
        return (
            <div >
                <Navbar />
                <Component {...props} />
            </div>
        )
    }
}

export default layout;