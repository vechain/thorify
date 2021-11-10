'use strict'
import {expect} from 'chai'
import { web3, wsUtility } from '../test-utils/init'

const ABI = [{ anonymous: false, inputs: [{ indexed: true, name: '_from', type: 'address' }, { indexed: true, name: '_to', type: 'address' }, { indexed: false, name: '_value', type: 'uint256' }], name: 'Transfer', type: 'event' }]
const Address = '0x0000000000000000000000000000456e65726779'
const contract = new web3.eth.Contract(ABI, Address)

describe('subscription: newBlockHeader', () => {
    it('newBlockHeader', (done) => {

        let emitData = false
        let emitChange = false
        let emitError = false
        let errorInfo

        const sub = web3.eth.subscribe('newBlockHeaders', '0x0009c5f530fa412e137ce153c53be953b7d7362482b855fce5572cb228879880').on('data', (data) => {
            if (data) {
                emitData = true
                try {
                    expect(data.removed).to.be.equal(false)
                    expect(data).to.have.all.keys('number', 'id', 'size', 'parentID', 'timestamp', 'gasLimit', 'beneficiary', 'gasUsed', 'totalScore', 'txsRoot', 'stateRoot', 'receiptsRoot', 'signer', 'transactions', 'removed')
                } catch (err) {
                    if (err && !errorInfo) {
                        errorInfo = err
                    }
                }
            }
        }).on('changed', (data) => {
            if (data) {
                emitChange = true
                try {
                    expect(data.removed).to.be.equal(true)
                    expect(data).to.have.all.keys('number', 'id', 'size', 'parentID', 'timestamp', 'gasLimit', 'beneficiary', 'gasUsed', 'totalScore', 'txsRoot', 'stateRoot', 'receiptsRoot', 'signer', 'transactions', 'removed')
                } catch (err) {
                    if (err && !errorInfo) {
                        errorInfo = err
                    }
                }
            }
        }).on('error', (error) => {
            if (error) {
                emitError = true
                try {
                    expect(() => { throw error || 'no error' }).to.throw('subscription error')
                } catch (err) {
                    if (err && !errorInfo) {
                        errorInfo = err
                    }
                }
            }
        })

        setTimeout(() => {
            wsUtility.emitData({
                number: 640501,
                id: '0x0009c5f530fa412e137ce153c53be953b7d7362482b855fce5572cb228879880',
                size: 436,
                parentID: '0x0009c5f44e202d4e8b6f224c0b52fc0847ee304cdcf8a83f60b4b1ee7d64c295',
                timestamp: 1536724130,
                gasLimit: 15752702,
                beneficiary: '0xd6d918cb7870c5752fe033c3461db32bcdb64fbd',
                gasUsed: 36582,
                totalScore: 63241711,
                txsRoot: '0xb5ec3ec421a7d255d62bc7b40d5202b049f52d83e5de2fdbd9f468722669105e',
                stateRoot: '0xb4f18c7744c26711880a3b6ad44ba35e2000201c4cc0e41269d9ff4d6cda5bce',
                receiptsRoot: '0x0e6083839f0bfc81de5e6f3dcf8d7cafb2188d5202dd8b9b50cbd1b1d2149f6a',
                signer: '0x8ee3b768b460d9a199e2c19eda7935f37b4a7b6e',
                transactions:
                    ['0x5692e1dd4c78dd8f4591cb4d5f3e1e6a9c406e7d969ad8a240ec4d05951b6bcc'],
                obsolete: false,
            })
        }, 50)

        setTimeout(() => {
            wsUtility.emitError('subscription error')
        }, 80)

        setTimeout(() => {
            wsUtility.emitData({
                number: 640501,
                id: '0x0009c5f530fa412e137ce153c53be953b7d7362482b855fce5572cb228879880',
                size: 436,
                parentID: '0x0009c5f44e202d4e8b6f224c0b52fc0847ee304cdcf8a83f60b4b1ee7d64c295',
                timestamp: 1536724130,
                gasLimit: 15752702,
                beneficiary: '0xd6d918cb7870c5752fe033c3461db32bcdb64fbd',
                gasUsed: 36582,
                totalScore: 63241711,
                txsRoot: '0xb5ec3ec421a7d255d62bc7b40d5202b049f52d83e5de2fdbd9f468722669105e',
                stateRoot: '0xb4f18c7744c26711880a3b6ad44ba35e2000201c4cc0e41269d9ff4d6cda5bce',
                receiptsRoot: '0x0e6083839f0bfc81de5e6f3dcf8d7cafb2188d5202dd8b9b50cbd1b1d2149f6a',
                signer: '0x8ee3b768b460d9a199e2c19eda7935f37b4a7b6e',
                transactions:
                    ['0x5692e1dd4c78dd8f4591cb4d5f3e1e6a9c406e7d969ad8a240ec4d05951b6bcc'],
                obsolete: true,
            })
        }, 100)

        setTimeout(() => {
            sub.unsubscribe()
            if (errorInfo) {
                done(errorInfo)
            } else if (emitData && emitChange && emitError) {
                const url = wsUtility.extractURL()
                expect(url).to.be.equal('/subscriptions/block?pos=0x0009c5f530fa412e137ce153c53be953b7d7362482b855fce5572cb228879880')
                done()
            }
        }, 250)

    })

    it('newBlockHeader with error ', (done) => {

        const sub = web3.eth.subscribe('newBlockHeaders').on('error', (error) => {
            if (error) {
                sub.unsubscribe()
                try {
                    expect(() => { throw error || 'no error' }).to.throw('subscription error')
                    done()
                } catch (err) {
                    done(err)
                }
            } else {
                done(new Error('No error thrown'))
            }
        })

        setTimeout(() => {
            wsUtility.emitError('subscription error')
        }, 50)

    })

    it('newBlockHeader with wrong data should not throw error', (done) => {

        const sub = web3.eth.subscribe('newBlockHeaders').on('error', (error) => {
            if (error) {
                done(error)
            }
        })

        setTimeout(() => {
            wsUtility.emitAnything('{ t')
        }, 20)

        setTimeout(() => {
            sub.unsubscribe()
            done()
        }, 50)

    })

    it('unexpected close should throw error', (done) => {

        const sub = web3.eth.subscribe('newBlockHeaders').on('error', (error) => {
            if (error) {
                sub.unsubscribe()
                try {
                    expect(() => { throw error || 'no error' }).to.throw('Connection closed')
                    done()
                } catch (err) {
                    done(err)
                }
            } else {
                done(new Error('No error thrown'))
            }
        })

        setTimeout(() => {
            wsUtility.emitClose()
        }, 50)

    })
})

describe('subscription: logs', () => {
    it('logs', (done) => {

        let emitData = false
        let emitChange = false
        let emitError = false
        let errorInfo

        const sub = web3.eth.subscribe('logs', { pos: '0x0009c5f530fa412e137ce153c53be953b7d7362482b855fce5572cb228879880'}).on('data', (data) => {
            if (data) {
                emitData = true
                try {
                    expect(data.removed).to.be.equal(false)
                    expect(data).to.have.all.keys('address', 'topics', 'data', 'meta', 'removed')
                } catch (err) {
                    if (err && !errorInfo) {
                        errorInfo = err
                    }
                }
            }
        }).on('changed', (data) => {
            if (data) {
                emitChange = true
                try {
                    expect(data.removed).to.be.equal(true)
                    expect(data).to.have.all.keys('address', 'topics', 'data', 'meta', 'removed')
                } catch (err) {
                    if (err && !errorInfo) {
                        errorInfo = err
                    }
                }
            }
        }).on('error', (error) => {
            if (error) {
                emitError = true
                try {
                    expect(() => { throw error || 'no error' }).to.throw('subscription error')
                } catch (err) {
                    if (err && !errorInfo) {
                        errorInfo = err
                    }
                }
            }
        })

        setTimeout(() => {
            wsUtility.emitData({
                address: '0x0000000000000000000000000000456e65726779',
                topics:
                    ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                        '0x0000000000000000000000001a97e5c055f97b1d42187df2d8a009e200ba2ab4',
                        '0x000000000000000000000000364b051ab244f941c1e3ddcc7ac5d09e6cb2b6f7'],
                data: '0x0000000000000000000000000000000000000000000000068155a43676e00000',
                meta:
                {
                    blockID: '0x0009c682edb6769dc5c45d2c5895ffd29a75047507276bded8e8e14c2baf9ac6',
                    blockNumber: 640642,
                    blockTimestamp: 1536725540,
                    txID: '0x36a90c6c72aff0e76fe559a3c1f100fe0cd0f4a3cb95025c59a5a68a56a570f9',
                    txOrigin: '0x1a97e5c055f97b1d42187df2d8a009e200ba2ab4',
                },
                obsolete: false,
            })
        }, 50)

        setTimeout(() => {
            wsUtility.emitError('subscription error')
        }, 80)

        setTimeout(() => {
            wsUtility.emitData({
                address: '0x0000000000000000000000000000456e65726779',
                topics:
                    ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                        '0x0000000000000000000000001a97e5c055f97b1d42187df2d8a009e200ba2ab4',
                        '0x000000000000000000000000364b051ab244f941c1e3ddcc7ac5d09e6cb2b6f7'],
                data: '0x0000000000000000000000000000000000000000000000068155a43676e00000',
                meta:
                {
                    blockID: '0x0009c682edb6769dc5c45d2c5895ffd29a75047507276bded8e8e14c2baf9ac6',
                    blockNumber: 640642,
                    blockTimestamp: 1536725540,
                    txID: '0x36a90c6c72aff0e76fe559a3c1f100fe0cd0f4a3cb95025c59a5a68a56a570f9',
                    txOrigin: '0x1a97e5c055f97b1d42187df2d8a009e200ba2ab4',
                },
                obsolete: true,
            })
        }, 100)

        setTimeout(() => {
            sub.unsubscribe()
            if (errorInfo) {
                done(errorInfo)
            } else if (emitData && emitChange && emitError) {
                const url = wsUtility.extractURL()
                expect(url).to.be.equal('/subscriptions/event?pos=0x0009c5f530fa412e137ce153c53be953b7d7362482b855fce5572cb228879880')
                done()
            }
        }, 250)

    })

    it('logs with error ', (done) => {

        const sub = web3.eth.subscribe('logs').on('error', (error) => {
            if (error) {
                sub.unsubscribe()
                try {
                    expect(() => { throw error || 'no error' }).to.throw('subscription error')
                    done()
                } catch (err) {
                    done(err)
                }
            } else {
                done(new Error('No error thrown'))
            }
        })

        setTimeout(() => {
            wsUtility.emitError('subscription error')
        }, 50)

    })
})

describe('subscription: transfers', () => {
    it('transfers', (done) => {

        let emitData = false
        let emitChange = false
        let emitError = false
        let errorInfo

        const sub = web3.eth.subscribe('transfers', { pos: '0x0009c5f530fa412e137ce153c53be953b7d7362482b855fce5572cb228879880' }).on('data', (data) => {
            if (data) {
                emitData = true
                try {
                    expect(data.removed).to.be.equal(false)
                    expect(data).to.have.all.keys('sender', 'recipient', 'amount', 'meta', 'removed')
                } catch (err) {
                    if (err && !errorInfo) {
                        errorInfo = err
                    }
                }
            }
        }).on('changed', (data) => {
            if (data) {
                emitChange = true
                try {
                    expect(data.removed).to.be.equal(true)
                    expect(data).to.have.all.keys('sender', 'recipient', 'amount', 'meta', 'removed')
                } catch (err) {
                    if (err && !errorInfo) {
                        errorInfo = err
                    }
                }
            }
        }).on('error', (error) => {
            if (error) {
                emitError = true
                try {
                    expect(() => { throw error || 'no error' }).to.throw('subscription error')
                } catch (err) {
                    if (err && !errorInfo) {
                        errorInfo = err
                    }
                }
            }
        })

        setTimeout(() => {
            wsUtility.emitData({
                sender: '0xa4adafaef9ec07bc4dc6de146934c7119341ee25',
                recipient: '0xd57ccf1a158d171370f383f099694fba4f4613c6',
                amount: '0xd48e758448bb418000',
                meta:
                {
                    blockID: '0x0009c6b5c830f4d51a34251fc328305aa5f8984101a3355270e251749f4fe3c3',
                    blockNumber: 640693,
                    blockTimestamp: 1536726050,
                    txID: '0x59e145340fcb083be9aabb7228dd3ec0ce31258352a1fd5080584e0c7e04354f',
                    txOrigin: '0xa4adafaef9ec07bc4dc6de146934c7119341ee25',
                },
                obsolete: false,
            })
        }, 50)

        setTimeout(() => {
            wsUtility.emitError('subscription error')
        }, 80)

        setTimeout(() => {
            wsUtility.emitData({
                sender: '0xa4adafaef9ec07bc4dc6de146934c7119341ee25',
                recipient: '0xd57ccf1a158d171370f383f099694fba4f4613c6',
                amount: '0xd48e758448bb418000',
                meta:
                {
                    blockID: '0x0009c6b5c830f4d51a34251fc328305aa5f8984101a3355270e251749f4fe3c3',
                    blockNumber: 640693,
                    blockTimestamp: 1536726050,
                    txID: '0x59e145340fcb083be9aabb7228dd3ec0ce31258352a1fd5080584e0c7e04354f',
                    txOrigin: '0xa4adafaef9ec07bc4dc6de146934c7119341ee25',
                },
                obsolete: true,
            })
        }, 100)

        setTimeout(() => {
            sub.unsubscribe()
            if (errorInfo) {
                done(errorInfo)
            } else if (emitData && emitChange && emitError) {
                const url = wsUtility.extractURL()
                expect(url).to.be.equal('/subscriptions/transfer?pos=0x0009c5f530fa412e137ce153c53be953b7d7362482b855fce5572cb228879880')
                done()
            }
        }, 250)

    })

    it('newBlockHeader with error ', (done) => {

        const sub = web3.eth.subscribe('transfers').on('error', (error) => {
            if (error) {
                sub.unsubscribe()
                done()
            } else {
                done(new Error('No error thrown'))
            }
        })

        setTimeout(() => {
            wsUtility.emitError('error')
        }, 50)

    })
})

describe('subscription: contract', () => {
    it('contract', (done) => {

        let emitData = false
        let emitChange = false
        let emitError = false
        let errorInfo

        const sub = contract.events.Transfer({pos: '0x0009c5f530fa412e137ce153c53be953b7d7362482b855fce5572cb228879880', filter: {_from: '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed'}}).on('data', (data) => {
            if (data) {
                emitData = true
                try {
                    expect(data.removed).to.be.equal(false)
                    expect(data).to.have.all.keys('address', 'event', 'meta', 'raw', 'returnValues', 'removed', 'signature')
                } catch (err) {
                    if (err && !errorInfo) {
                        errorInfo = err
                    }
                }
            }
        }).on('changed', (data) => {
            if (data) {
                emitChange = true
                try {
                    expect(data.removed).to.be.equal(true)
                    expect(data).to.have.all.keys('address', 'event', 'meta', 'raw', 'returnValues', 'removed', 'signature')
                } catch (err) {
                    if (err && !errorInfo) {
                        errorInfo = err
                    }
                }
            }
        }).on('error', (error) => {
            if (error) {
                emitError = true
                try {
                    expect(() => { throw error || 'no error' }).to.throw('subscription error')
                } catch (err) {
                    if (err && !errorInfo) {
                        errorInfo = err
                    }
                }
            }
        })

        setTimeout(() => {
            wsUtility.emitData({
                address: '0x0000000000000000000000000000456e65726779',
                topics: [
                    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                    '0x0000000000000000000000007567d83b7b8d80addcb281a71d54fc7b3364ffed',
                    '0x0000000000000000000000007567d83b7b8d80addcb281a71d54fc7b3364ffed',
                ],
                data: '0x0000000000000000000000000000000000000000000000000000000000000001',
                meta: {
                    blockID: '0x000001136820faf9fefc4feab2a83ceb4d5141a52e19b857e3cb91a7e51776c4',
                    blockNumber: 275,
                    blockTimestamp: 1536748891,
                    txID: '0xa3c7ad107664e1b2ca089deb3d1b0fe69706abcfda12e375acb8e02dfa61fa41',
                    txOrigin: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
                },
                obsolete: false,
            })
        }, 50)

        setTimeout(() => {
            wsUtility.emitError('subscription error')
        }, 80)

        setTimeout(() => {
            wsUtility.emitData({
                address: '0x0000000000000000000000000000456e65726779',
                topics: [
                    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                    '0x0000000000000000000000007567d83b7b8d80addcb281a71d54fc7b3364ffed',
                    '0x0000000000000000000000007567d83b7b8d80addcb281a71d54fc7b3364ffed',
                ],
                data: '0x0000000000000000000000000000000000000000000000000000000000000001',
                meta: {
                    blockID: '0x000001136820faf9fefc4feab2a83ceb4d5141a52e19b857e3cb91a7e51776c4',
                    blockNumber: 275,
                    blockTimestamp: 1536748891,
                    txID: '0xa3c7ad107664e1b2ca089deb3d1b0fe69706abcfda12e375acb8e02dfa61fa41',
                    txOrigin: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
                 },
                obsolete: true,
            })
        }, 100)

        setTimeout(() => {
            sub.unsubscribe()
            if (errorInfo) {
                done(errorInfo)
            } else if (emitData && emitChange && emitError) {
                const url = wsUtility.extractURL()
                expect(url).to.be.equal('/subscriptions/event?addr=0x0000000000000000000000000000456e65726779&t0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&t1=0x0000000000000000000000007567d83b7b8d80addcb281a71d54fc7b3364ffed')
                done()
            }
        }, 250)

    })

    it('contract subscription return error should throw', (done) => {

        const sub = contract.events.Transfer().on('error', (error) => {
            sub.unsubscribe()
            try {
                expect(() => { throw error || 'no error' }).to.throw('subscription error')
                done()
            } catch (err) {
                done(err)
            }
        })

        setTimeout(() => {
            wsUtility.emitError('subscription error')
        }, 50)

    })

    it('contract subscription with multiple topic filter should throw error', (done) => {

        try {
            contract.events.Transfer({ filter: { _from: ['0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed', '0xD3ae78222BEADB038203bE21eD5ce7C9B1BfF602'] } })
            done(new Error('No error thrown'))
        } catch (err) {
            expect(() => { throw err || 'no error' }).to.throw('[thorify] Array filter option is not supported in thor, must be null or bytes32 string')
            done()
        }

    })

})
