import Layout from '../../components/Layout'
import Filter from '../../components/Filter'
import ProductCard from '../../components/ProductCard'
import { useRef, useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import HomepageSkeleton from '../skeleton/HomepageSkeleton'

const GridDisplay = ({ arr }) => {
  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  };

  return (
    <div style={gridContainerStyle}>
      {arr.map((item, index) => (
        <div key={index}>
          {item}
        </div>
      ))}
    </div>
  );
};

const Homepage = ({ products, loader }) => {

  // Renderchecker
  const count = useRef(0);
  useEffect(() => {
    count.current = count.current + 1;
  });

  const [fetchedData, setFetchedData]=useState([])  

  useEffect(()=>{
    loader().then((arr)=>setFetchedData(arr))
  },[])

  const [fetched, setFetched] = useState(false) 


  const arr = useMemo(() => {
    if (products.length === 0 && !fetched) {
      return fetchedData.map((product, index) => (
        <div key={index}>
          <ProductCard
            productName={product.name}
            price={product.price}
            quantity={product.quantity}
            color={product.color}
            sku={product.sku}
            image={product.image}
          />
        </div>
      ));
    }
    setFetched(true)
    return products.map((product, index) => (
      <div key={index}>
        <ProductCard
          productName={product.name}
          price={product.price}
          quantity={product.quantity}
          color={product.color}
          sku={product.sku}
          image={product.image}
        />
      </div>
    ));
  }, [products, fetchedData]);


  const Grid = useMemo(() => GridDisplay, [arr])

  return (
    <div>
      {fetchedData.length === 0 ? (
        <HomepageSkeleton />
      ) : (
        <div style={{ display: 'flex', margin: 20, flexDirection: 'row' }}>
          <div style={{ position: 'fixed', top: 90 }}>
            <div>Rendered: {count.current}</div>
            {/* Renderchecker */}
            <Filter />
          </div>
          <div style={{ position: 'absolute', left: 300, top: 90 }}>
            <Grid arr={arr} />
          </div>
        </div>
      )}
    </div>
  );


}
const mapStateToProps = (state) => ({
  products: state.market.products,
});

export default Layout(connect(mapStateToProps)(Homepage));