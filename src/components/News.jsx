import { Avatar, Card, Col, Row, Select, Typography } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { useGetCryptosQuery } from '../services/cryptoApi';
import { useGetCryptoNewsQuery } from '../services/cryptoNewsApi';

const News = ({ simplified }) => {

    const [newsCategory, setNewsCategory] = useState('Cryptocurrency');
    const {data: cryptoNews, isFetching } = useGetCryptoNewsQuery({ newsCategory, count: simplified ? 6 : 12 });
    const { data } = useGetCryptosQuery(100);

    const demoImage = 'https://www.bing.com/th?id=OVFT.mpzuVZnv8dwIMRfQGPbOPC&pid=News';

    if (isFetching) return 'Loading...';

    console.log(cryptoNews);
    return (
        <Row gutter={[ 24, 24 ]}>
            {
                !simplified && (
                    <Col span={24}>
                        <Select
                            showSearch
                            className='select-news'
                            placeholder='Select a Crypto'
                            optionFilterProp='children'
                            onChange={(value) => setNewsCategory(value)}
                            filterOption={ (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 }
                        >
                            <Select.Option value='Cryptocurrency'>Cryptocurrency</Select.Option>
                            {
                                data?.data?.coins?.map((coin, i) => <Select.Option key={`coin_` + i} value={coin.name}>{coin.name}</Select.Option>)
                            }
                        </Select>
                    </Col>
                )
            }
            {
                cryptoNews.value.map((news, i) => (
                    <Col xs={24} sm={12} lg={8} key={i}>
                        <Card hoverable className="news-card">
                            <a href={news.url} target="_blank" rel="noreferrer">
                                <div className='news-image-container'>
                                    <Typography.Title className='news-title' level={4}> {news.title} </Typography.Title>
                                    <img style={{ maxWidth: '200px', maxHeight: '100px'}} src={ news?.image?.thumbnail?.contentUrl || demoImage } alt="news" />
                                </div>
                                <p>
                                    { 
                                        news.description > 100 ? `${news.description.substring(0,100)} ...` : news.description
                                    }
                                </p>
                                <div className="provider-container">
                                    <Avatar src={news.provider[0]?.image?.thumbnail?.contentUrl || demoImage} alt="avatar" />
                                    <Typography.Text className="provider-name">{ news.provider[0]?.name }</Typography.Text>
                                </div>
                                <Typography.Text>{ moment(news.datePublished).startOf('ss').fromNow() }</Typography.Text>
                            </a>
                        </Card>
                    </Col>
                ))
            }
        </Row>
    );
}
 
export default News;
