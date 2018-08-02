import { List, Avatar, Pagination  } from 'antd';
import React,{Component,PropTypes} from 'react' ;

const data = [
    {
      title: 'Ant Design Title 1',
    },
    {
      title: 'Ant Design Title 2',
    },
    {
      title: 'Ant Design Title 3',
    },
    {
      title: 'Ant Design Title 4',
    },
    {
      title: 'Ant Design Title 4',
    },
    {
      title: 'Ant Design Title 4',
    },
    {
      title: 'Ant Design Title 4',
    },
    {
      title: 'Ant Design Title 4',
    },
    {
      title: 'Ant Design Title 4',
    },
  ];
export default class DemoList extends React.Component {


render(){
    return (
        <div>
        <List
          itemLayout="horizontal"
          dataSource={data}
          pagination={{
              onChange: (page) => {
                console.log(page);
              },
              pageSize: 5,
            }}
          renderItem={ item => ( 
            <List.Item actions={[<a>deposit</a>, <a>withdraw</a>]}>
              <List.Item.Meta
                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                title={<a href="https://ant.design">{item.title}</a>}
                description='crypto asset'
              />
            </List.Item>
          )}
        />,
        </div>
      ) 
    }

}

