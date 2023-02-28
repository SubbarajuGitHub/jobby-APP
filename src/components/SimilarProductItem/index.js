import {Component} from 'react'

import './index.css'

class SimilarProduct extends Component {
  render() {
    const {each} = this.props
    const {imageUrl, brand, title, rating, price} = each
    return (
      <li className="list-items">
        <img src={imageUrl} alt="similar product" className="small-image" />
        <h1 className="small-title">{title}</h1>
        <p className="small-brand">by {brand}</p>
        <div className="price-div-small">
          <p className="small-price">Rs {price}/-</p>
          <div className="rating-div-small">
            <p className="small-rating">{rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="stars"
            />
          </div>
        </div>
      </li>
    )
  }
}
export default SimilarProduct
