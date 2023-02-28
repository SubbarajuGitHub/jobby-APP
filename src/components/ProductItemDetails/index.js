import {Component} from 'react'

import './index.css'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Loader from 'react-loader-spinner'

import {Link} from 'react-router-dom'

import Cookies from 'js-cookie'

import Header from '../Header'

import SimilarProduct from '../SimilarProductItem'

const apiStatusConstants = {
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    specificProduct: [],
    similarProductsLists: [],
    count: 0,
    apiStatus: apiStatusConstants.inProgress,
  }

  componentDidMount() {
    this.getSpecificProduct()
  }

  onIncrease = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  onDecrease = () => {
    const {count} = this.state
    if (count > 0) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  getSpecificProduct = async () => {
    const {specificProduct} = this.state
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const FetchedData = await fetch(url, options)
    const data = await FetchedData.json()
    if (FetchedData.ok === true) {
      const similarProductsData = data.similar_products.map(each => ({
        imageUrl: each.image_url,
        availability: each.availability,
        description: each.description,
        brand: each.brand,
        id: each.id,
        price: each.price,
        rating: each.rating,
        title: each.title,
        totalReviews: each.total_reviews,
      }))

      const ConvertedData = {
        imageUrl: data.image_url,
        availability: data.availability,
        description: data.description,
        brand: data.brand,
        id: data.id,
        price: data.price,
        rating: data.rating,
        title: data.title,
        totalReviews: data.total_reviews,
      }
      this.setState({
        specificProduct: ConvertedData,
        similarProductsLists: similarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderProductsLists = () => {
    const {specificProduct, similarProductsLists, count} = this.state
    const {
      imageUrl,
      availability,
      description,
      id,
      price,
      rating,
      title,
      totalReviews,
      brand,
    } = specificProduct
    return (
      <div className="bg">
        <Header />
        <div className="specific-product-div">
          <img src={imageUrl} alt="product" className="specific-image" />
          <div className="second-div">
            <h1 className="detailed-title">{title}</h1>
            <p className="detailed-price">Rs {price}/-</p>
            <div className="rating-div">
              <div className="star-div">
                <p className="detailed-rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="stars"
                />
              </div>
              <p className="detailed-reviews">{totalReviews} Reviews</p>
            </div>
            <p className="detailed-description">{description}</p>
            <p className="detailed-availability">
              Available: <p className="span">{availability}</p>
            </p>
            <p className="detailed-brand">
              Brand: <p className="span">{brand}</p>
            </p>
            <div className="adding-item-count">
              <button
                type="button"
                className="buttons"
                onClick={this.onDecrease}
                data-testid="minus"
              >
                <BsDashSquare className="icons" />
              </button>
              <p className="count">{count}</p>
              <button
                type="button"
                className="buttons1"
                onClick={this.onIncrease}
                data-testid="plus"
              >
                <BsPlusSquare className="icons" />
              </button>
            </div>
            <Link to="/cart">
              <button type="button" className="cart-button">
                ADD TO CART
              </button>
            </Link>
          </div>
        </div>
        <h1 className="similar-product-heading">Similar Products</h1>
        <ul className="unorderd-list">
          {similarProductsLists.map(each => (
            <SimilarProduct each={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureProducts = () => {
    const {specificProduct, similarProductsLists, count} = this.state
    return (
      <div>
        <Header />
        <div className="failure-div">
          <div>
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
              alt="failure view"
              className="failure-image"
            />
            <h1 className="product-not-found">Product Not Found</h1>
            <Link to="/products">
              <button className="continue-shopping" type="button">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  renderLoaderBeforeProductsLists = () => (
    <div data-testid="loader" className="loader-div">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderProductDeals = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsLists()
      case apiStatusConstants.failure:
        return this.renderFailureProducts()
      case apiStatusConstants.inProgress:
        return this.renderLoaderBeforeProductsLists()
      default:
        return null
    }
  }

  render() {
    return <div>{this.renderProductDeals()}</div>
  }
}
export default ProductItemDetails
