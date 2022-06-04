import {createServer} from "../index.js";
import request from 'supertest';
import {expect} from "chai";

describe('integration tests', () => {
    let server, url;

    before(async () => {
        try {
            ({server, url} = await createServer({port: 4001}));
        } catch (e) {
            console.log(e)
        }
    });

    after(async () => {
        await server?.close();
        console.log("Server closed")
    });

    it('should return bridge transaction for chain', async () => {
        let queryData = {
            query: `
            query {
                bridgeTransactions(chainId: 1) {
                    kappa
                }
            }
            `,
            variables: {},
        }
        const response = await request(url).post('/').send(queryData);
        let responseBody = response.body.data.bridgeTransactions
        expect(responseBody).to.be.an('array').that.is.not.empty;
        expect(responseBody[0].kappa).to.be.an('string');
    }).timeout(10000);

    it('should return recent transactions', async () => {
        let queryData = {
            query: `
            query {
                latestBridgeTransactions {
                    kappa
                }
            }
            `,
            variables: {},
        }
        const response = await request(url).post('/').send(queryData);
        let responseBody = response.body.data.latestBridgeTransactions
        expect(responseBody).to.be.an('array').that.is.not.empty;
        expect(responseBody[0].kappa).to.be.an('string');
    }).timeout(10000);


    it('should return mean for all transactions on a chain', async () => {
        let queryData = {
            query: `
            query {
                meanBridgeAmount(duration:ALL_TIME, chainId:1) {
                    value
                }
            }
            `,
            variables: {},
        }
        const response = await request(url).post('/').send(queryData);
        let responseBody = response.body.data.meanBridgeAmount
        expect(parseFloat(responseBody.value)).to.be.an("number")
    }).timeout(10000);

    it('should return median for all transactions on a chain', async () => {
        let queryData = {
            query: `
            query {
                medianBridgeAmount(duration:ALL_TIME, chainId:56) {
                    value
                }
            }
            `,
            variables: {},
        }
        const response = await request(url).post('/').send(queryData);
        let responseBody = response.body.data.medianBridgeAmount
        expect(parseFloat(responseBody.value)).to.be.an("number")
    }).timeout(10000);

    it('should return total for all transactions across all chains', async () => {
        let queryData = {
            query: `
            query {
                totalBridgeAmount(duration:ALL_TIME, chainId:1) {
                    value
                }
            }
            `,
            variables: {},
        }
        const response = await request(url).post('/').send(queryData);
        let responseBody = response.body.data.totalBridgeAmount
        expect(parseFloat(responseBody.value)).to.be.an("number")
    }).timeout(10000);

    it('should return count for all transactions across all chains', async () => {
        let queryData = {
            query: `
            query {
                countBridgeTransactions {
                    value
                }
            }
            `,
            variables: {},
        }
        const response = await request(url).post('/').send(queryData);
        let responseBody = response.body.data.countBridgeTransactions
        expect(parseFloat(responseBody.value)).to.be.an("number")
    }).timeout(10000);

    it('should return count by token address', async () => {
        let queryData = {
            query: `
            query {
                countByTokenAddress(address: "0xfa2ab4F2bd1f2514787A3DfF85067cc609B75f98", hours:100000) {
                    count
                }
            }
            `,
            variables: {},
        }
        const response = await request(url).post('/').send(queryData);
        let responseBody = response.body.data.countByTokenAddress
        expect(responseBody).to.be.an('array').that.is.not.empty;
        expect(responseBody[0].count).to.be.greaterThan(0)
    }).timeout(10000);

    it('should return count by chain id', async () => {
        let queryData = {
            query: `
            query {
                countByChainId(chainId:1) {
                    count
                }
            }
            `,
            variables: {},
        }
        const response = await request(url).post('/').send(queryData);
        let responseBody = response.body.data.countByChainId
        expect(responseBody).to.be.an('array').that.is.not.empty;
        expect(responseBody[0].count).to.be.greaterThan(0)
    }).timeout(10000);

    it('should return address ranking', async () => {
        let queryData = {
            query: `
            query {
                addressRanking {
                    address
                    count
                }
            }
            `,
            variables: {},
        }
        const response = await request(url).post('/').send(queryData);
        let responseBody = response.body.data.addressRanking
        expect(responseBody).to.be.an('array').that.is.not.empty;
        expect(responseBody[0].address).to.be.an("string")
        expect(responseBody[0].count).to.be.greaterThan(0)
    }).timeout(10000);

})