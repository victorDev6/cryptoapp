import millify from 'millify';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } from '../services/cryptoApi';
import { DollarCircleOutlined, NumberOutlined, ThunderboltOutlined, TrophyOutlined, FundOutlined, MoneyCollectOutlined, CheckOutlined, StopOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Col, Row, Select, Typography } from 'antd';
import HTMLReactParser from 'html-react-parser';
import LineChart from './LineChart';

const CryptoDetails = () => {

    const { coinId } = useParams();
    const [timePeriod, setTimePeriod] = useState('7d');
    const { data, isFetching } = useGetCryptoDetailsQuery(coinId);
    const { data: coinHistory, isFetching: gettingHistory} = useGetCryptoHistoryQuery({coinId, timePeriod});

    if (isFetching || gettingHistory) return 'Loading...';

    const cryptoDetails = data.data.coin;
    const time = ['3h', '24h', '7d', '30d', '1y', '3m', '3y', '5y'];
    const stats = [
        { title: 'Price to USD', value: `$ ${cryptoDetails.price && millify(cryptoDetails.price)}`, icon: <DollarCircleOutlined /> },
        { title: 'Rank', value: cryptoDetails.rank, icon: <NumberOutlined /> },
        { title: '24h Volume', value: `$ ${cryptoDetails.volume && millify(cryptoDetails.volume)}`, icon: <ThunderboltOutlined /> },
        { title: 'Market Cap', value: `$ ${cryptoDetails.marketCap && millify(cryptoDetails.marketCap)}`, icon: <DollarCircleOutlined /> },
        { title: 'All-time-high(daily avg.)', value: `$ ${millify(cryptoDetails.allTimeHigh.price)}`, icon: <TrophyOutlined /> },
    ];
    const genericStats = [
        { title: 'Number Of Markets', value: cryptoDetails.numberOfMarkets, icon: <FundOutlined /> },
        { title: 'Number Of Exchanges', value: cryptoDetails.numberOfExchanges, icon: <MoneyCollectOutlined /> },
        { title: 'Aprroved Supply', value: cryptoDetails.approvedSupply ? <CheckOutlined /> : <StopOutlined />, icon: <ExclamationCircleOutlined /> },
        { title: 'Total Supply', value: `$ ${millify(cryptoDetails.totalSupply)}`, icon: <ExclamationCircleOutlined /> },
        { title: 'Circulating Supply', value: `$ ${millify(cryptoDetails.circulatingSupply)}`, icon: <ExclamationCircleOutlined /> },
    ];

    return (
        <Col className="coin-detail-container">
            <Col className="coin-heading-container">
                <Typography.Title level={2} className="coin-name">
                    { cryptoDetails.name } ({ cryptoDetails.symbol }) Price
                </Typography.Title>
                <p>
                    { cryptoDetails.name } live price in US dollars.
                    View value statistics, market cap and supply.
                </p>
            </Col>
            <Select defaultValue="7d" className="select-timeperiod"  placeholder="Select Time Period" onChange={(value) => setTimePeriod(value)} >
                {
                    time.map((date) => <Select.Option key={date}>{ date }</Select.Option>)
                }
            </Select>
            <LineChart coinHistory={coinHistory} currentPrice={millify(cryptoDetails.price)} coinName={cryptoDetails.name} />
            <Col className="stats-container">
                <Col className="coin-value-statistics">
                    <Col className="coin-value-statistics-heading">
                        <Typography.Title level={3} className="coin-detailes-heading"> 
                            { cryptoDetails.name } Value Statistics 
                        </Typography.Title>
                        <p>An overview showing the stats of { cryptoDetails.name }</p>
                    </Col>
                    {
                        stats.map(({ icon, title, value }, i) => (
                            <Col key={`stats_` + i} className="coin-stats">
                                <Col className="coin-stats-name">
                                    <Typography.Text>{ icon }</Typography.Text>
                                    <Typography.Text>{ title }</Typography.Text>
                                </Col>
                                <Typography.Text className="stats"> { value } </Typography.Text>
                            </Col>
                        ))
                    }
                </Col>
                <Col className="other-stats-info">
                    <Col className="coin-value-statistics-heading">
                        <Typography.Title level={3} className="coin-detailes-heading"> 
                            Other Statistics 
                        </Typography.Title>
                        <p>An overview showing the stats of all cryptocurrencies</p>
                    </Col>
                    {
                        genericStats.map(({ icon, title, value }, i) => (
                            <Col key={`generic` + i} className="coin-stats">
                                <Col className="coin-stats-name">
                                    <Typography.Text>{ icon }</Typography.Text>
                                    <Typography.Text>{ title }</Typography.Text>
                                </Col>
                                <Typography.Text className="stats"> { value } </Typography.Text>
                            </Col>
                        ))
                    }
                </Col>
            </Col>
            <Col className="coin-desc-link">
                <Row className="coin-desc">
                    <Typography.Title level={3} className="coin-details-heading">
                        What is { cryptoDetails.name }?
                        { HTMLReactParser(cryptoDetails.description) }
                    </Typography.Title>
                </Row>
                <Col className="coin-links">
                    <Typography.Title level={3} className="coin-details-heading">
                        { cryptoDetails.name } Links
                    </Typography.Title>
                    {
                        cryptoDetails.links.map((link) => (
                            <Row key={link.name} className="coin-link">
                                <Typography.Title level={5} className="link-name">{ link.type }</Typography.Title>
                                <a href={link.url} target="_blank" rel="noreferrer">{ link.name }</a>
                            </Row>
                        ))
                    }
                </Col>
            </Col>
        </Col>
    );
}

export default CryptoDetails;
