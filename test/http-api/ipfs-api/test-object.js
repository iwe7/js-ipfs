/* eslint-env mocha */
'use strict'

const expect = require('chai').expect
const fs = require('fs')
const DAGLink = require('ipfs-merkle-dag').DAGLink

module.exports = (ctl) => {
  describe('.object', () => {
    it('.new', (done) => {
      ctl.object.new((err, result) => {
        expect(err).to.not.exist
        const res = result.toJSON()
        expect(res.Hash)
          .to.equal('QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n')
        expect(res.Links).to.be.eql([])
        done()
      })
    })

    describe('.get', () => {
      it('returns error for request without argument', (done) => {
        ctl.object.get(null, (err, result) => {
          expect(err).to.exist
          done()
        })
      })

      it('returns error for request with invalid argument', (done) => {
        ctl.object.get('invalid', {enc: 'base58'}, (err, result) => {
          expect(err).to.exist
          done()
        })
      })

      it('returns value', (done) => {
        ctl.object.get('QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n', {enc: 'base58'}, (err, result) => {
          expect(err).to.not.exist
          const res = result.toJSON()
          expect(res.Links).to.be.eql([])
          expect(res.Data).to.equal('')
          done()
        })
      })
    })

    describe('.put', () => {
      it('returns error if the node is invalid', (done) => {
        const filePath = 'test/test-data/badnode.json'

        ctl.object.put(filePath, {enc: 'json'}, (err) => {
          expect(err).to.exist
          done()
        })
      })

      it('updates value', (done) => {
        const filePath = fs.readFileSync('test/test-data/node.json')
        const expectedResult = {
          Data: 'another',
          Hash: 'QmZZmY4KCu9r3e7M2Pcn46Fc5qbn6NpzaAGaYb22kbfTqm',
          Links: [{
            Name: 'some link',
            Hash: 'QmXg9Pp2ytZ14xgmQjYEiHjVjMFXzCVVEcRTWJBmLgR39V',
            Size: 8
          }],
          Size: 68
        }

        ctl.object.put(filePath, {enc: 'json'}, (err, res) => {
          expect(err).not.to.exist
          expect(res.toJSON()).to.deep.equal(expectedResult)
          done()
        })
      })
    })

    describe('.stat', () => {
      it('returns error for request without argument', (done) => {
        ctl.object.stat(null, (err, result) => {
          expect(err).to.exist
          done()
        })
      })

      it('returns error for request with invalid argument', (done) => {
        ctl.object.stat('invalid', {enc: 'base58'}, (err, result) => {
          expect(err).to.exist
          done()
        })
      })

      it('returns value', (done) => {
        ctl.object.stat('QmZZmY4KCu9r3e7M2Pcn46Fc5qbn6NpzaAGaYb22kbfTqm', {enc: 'base58'}, (err, result) => {
          expect(err).to.not.exist
          expect(result.Hash).to.equal('QmZZmY4KCu9r3e7M2Pcn46Fc5qbn6NpzaAGaYb22kbfTqm')
          expect(result.NumLinks).to.equal(1)
          expect(result.BlockSize).to.equal(60)
          expect(result.LinksSize).to.equal(60 - 7)
          expect(result.DataSize).to.equal(7)
          expect(result.CumulativeSize).to.equal(60 + 8)
          done()
        })
      })
    })

    describe('.data', () => {
      it('returns error for request without argument', (done) => {
        ctl.object.data(null, (err, result) => {
          expect(err).to.exist
          done()
        })
      })

      it('returns error for request with invalid argument', (done) => {
        ctl.object.data('invalid', {enc: 'base58'}, (err, result) => {
          expect(err).to.exist
          done()
        })
      })

      it('returns value', (done) => {
        ctl.object.data('QmZZmY4KCu9r3e7M2Pcn46Fc5qbn6NpzaAGaYb22kbfTqm', {enc: 'base58'}, (err, result) => {
          expect(err).to.not.exist
          expect(result.toString()).to.equal('another')
          done()
        })
      })
    })

    describe('.links', () => {
      it('returns error for request without argument', (done) => {
        ctl.object.links(null, (err, result) => {
          expect(err).to.exist
          done()
        })
      })

      it('returns error for request with invalid argument', (done) => {
        ctl.object.links('invalid', {enc: 'base58'}, (err, result) => {
          expect(err).to.exist
          done()
        })
      })

      it('returns value', (done) => {
        const expectedResult = {
          Name: 'some link',
          Hash: 'QmXg9Pp2ytZ14xgmQjYEiHjVjMFXzCVVEcRTWJBmLgR39V',
          Size: 8
        }

        ctl.object.links('QmZZmY4KCu9r3e7M2Pcn46Fc5qbn6NpzaAGaYb22kbfTqm', {enc: 'base58'}, (err, result) => {
          expect(err).to.not.exist
          expect(result[0].toJSON()).to.deep.equal(expectedResult)
          done()
        })
      })
    })

    describe('.patch.appendData', () => {
      it('returns error for request without key & data', (done) => {
        ctl.object.patch.appendData(null, null, (err) => {
          expect(err).to.exist
          done()
        })
      })

      it('returns error for request without data', (done) => {
        const filePath = 'test/test-data/badnode.json'

        ctl.object.patch.appendData(null, filePath, (err) => {
          expect(err).to.exist
          done()
        })
      })

      it('updates value', (done) => {
        const key = 'QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n'
        const filePath = 'test/test-data/badnode.json'
        const expectedResult = {
          Data: fs.readFileSync(filePath).toString(),
          Hash: 'QmfY37rjbPCZRnhvvJuQ46htW3VCAWziVB991P79h6WSv6',
          Links: [],
          Size: 19
        }

        ctl.object.patch.appendData(key, filePath, {enc: 'base58'}, (err, res) => {
          expect(err).not.to.exist
          expect(res.toJSON()).to.deep.equal(expectedResult)
          done()
        })
      })
    })

    describe('.patch.setData', () => {
      it('returns error for request without key & data', (done) => {
        ctl.object.patch.setData(null, null, (err) => {
          expect(err).to.exist
          done()
        })
      })

      it('returns error for request without data', (done) => {
        const filePath = 'test/test-data/badnode.json'

        ctl.object.patch.setData(null, filePath, (err) => {
          expect(err).to.exist
          done()
        })
      })

      it('updates value', (done) => {
        const key = 'QmfY37rjbPCZRnhvvJuQ46htW3VCAWziVB991P79h6WSv6'
        const filePath = 'test/test-data/badnode.json'
        const expectedResult = {
          Data: fs.readFileSync(filePath).toString(),
          Hash: 'QmfY37rjbPCZRnhvvJuQ46htW3VCAWziVB991P79h6WSv6',
          Links: [],
          Size: 19
        }

        ctl.object.patch.setData(key, filePath, {enc: 'base58'}, (err, res) => {
          expect(err).not.to.exist
          expect(res.toJSON()).to.deep.equal(expectedResult)
          done()
        })
      })
    })

    describe('.patch.addLink', () => {
      it('returns error for request without arguments', (done) => {
        ctl.object.patch.addLink(null, null, null, (err) => {
          expect(err).to.exist
          done()
        })
      })

      it('returns error for request only one invalid argument', (done) => {
        ctl.object.patch.addLink('invalid', null, null, (err) => {
          expect(err).to.exist
          done()
        })
      })

      it('returns error for request without name', (done) => {
        const root = 'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn'
        const name = ''
        const ref = 'QmTz3oc4gdpRMKP2sdGUPZTAGRngqjsi99BPoztyP53JMM'
        const link = new DAGLink(name, 2, ref)
        ctl.object.patch.addLink(root, link, {enc: 'base58'}, (err) => {
          expect(err).to.exist
          done()
        })
      })

      it('updates value', (done) => {
        const root = 'QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n'
        const name = 'foo'
        const ref = 'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn'
        const link = new DAGLink(name, 10, ref)
        ctl.object.patch.addLink(root, link, {enc: 'base58'}, (err, result) => {
          expect(err).not.to.exist
          const res = result.toJSON()
          expect(res.Hash).to.equal('QmdVHE8fUD6FLNLugtNxqDFyhaCgdob372hs6BYEe75VAK')
          expect(res.Links[0]).to.deep.equal({
            Name: 'foo',
            Hash: 'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn',
            Size: 4
          })
          done()
        })
      })
    })

    describe('.patch.rmLink', () => {
      it('returns error for request without arguments', (done) => {
        ctl.object.patch.rmLink(null, null, (err) => {
          expect(err).to.exist
          done()
        })
      })

      it('returns error for request only one invalid argument', (done) => {
        ctl.object.patch.rmLink('invalid', null, (err) => {
          expect(err).to.exist
          done()
        })
      })

      it('returns error for request with invalid first argument', (done) => {
        const root = ''
        const link = 'foo'

        ctl.object.patch.rmLink(root, link, (err) => {
          expect(err).to.exist
          done()
        })
      })

      it('updates value', (done) => {
        const root = 'QmdVHE8fUD6FLNLugtNxqDFyhaCgdob372hs6BYEe75VAK'
        const link = new DAGLink('foo')

        ctl.object.patch.rmLink(root, link, {enc: 'base58'}, (err, res) => {
          expect(err).not.to.exist
          expect(res.toJSON().Hash).to.equal('QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n')
          done()
        })
      })
    })
  })
}
