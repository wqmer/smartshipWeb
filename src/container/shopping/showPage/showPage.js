import React,{Component,PropTypes} from 'react'
import ReactDOM from 'react-dom';
import Mycard from './card'
import { Skeleton, List , Card ,Col, Row} from 'antd'
import axios from 'axios'

class ShowPage extends Component{
    constructor(props){
        super(props);
    }

    state =  {image:[]}
    async componentDidMount () {

       const response = await axios.get('https://api.unsplash.com/search/photos', {
           params: { query: 'product' , page: 8, per_page:30}, 
           headers: {
               Authorization: 'Client-ID 1c555b5aba567b6e838a27da62a4e4004d6745a6ff1812135a5d4fc3751edfa2'
           }
        });
        //    console.log(response.results)
           this.setState({image:response.results}) 
 
    }

    render(){   
        const { Meta } = Card;
        const data = this.state.image.length > 0 ?  this.state.image : new Array (8)
        return (  <div> 
             <List
                   pagination={{  pageSize: 12 }}
                   grid={{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 5, }}
                   dataSource= {data}
                   renderItem ={ item => ( item?
                                 <List.Item>                                 
                                             <a onClick = {()=> console.log('should work')}> 
                                             <Mycard url = {item.urls.raw +'&fit=crop&w=500&h=600'} title ='样本商品' desc = {item.description == undefined ? 'This is description':item.description }/> 
                                             </a> 
                                    
                                </List.Item>  

                                :  
                                 <List.Item>   
                                  <Skeleton loading active />              
                                 </List.Item>  
             
                         
                         )} />           
                           {/* <Skeleton loading={this.state.loading}>
                           <div>
                              <h4>Ant Design, a design language</h4>
                              <p>We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.</p>
                          </div>
                           </Skeleton> */}
        </div>
       )
    }
}



export default ShowPage

// function mapStateToProps(state) {
//     return {
//            order:state.user.order,
//            isFetching:state.globalState.isFetching
//     }
// }

// function mapDispatchToProps(dispatch) {
//     return{
//           getAllorder : bindActionCreators(actions.get_all_order,dispatch),
//     }
// }

// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(order)
