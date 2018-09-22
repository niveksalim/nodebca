const BCA = require('./bca');

/**
 * BCA Fire Class
 */
class Fire extends BCA {
  /**
   * Provides service transaction “Transaction to BCA’s Account” and also “Transfer to Other Bank”
   * @param {Object} param.body - Request body
   * @return {Promise<Object>} Promise resolved with successful action
   */
  async transfer(body) {
    return this.request({
      method: 'POST',
      relativeUrl: '/fire/transactions/to-account',
      body: JSON.stringify(body),
    });
  }

  /**
   * Provides service to Inquiry BCA’s Account name or Other Bank Switching’s Account name
   * @param {Object} body - Request body
   * @return {Promise<Object>} Promise resolved with successful action
   */
  async inquiryAccount(body) {
    return this.request({
      method: 'POST',
      relativeUrl: '/fire/accounts',
      body: JSON.stringify(body),
    });
  }

  /**
   * Provides service to Inquiry balance for Vostro’s Account
   * @param {Object} body - Request body
   * @return {Promise<Object>} Promise resolved with successful action
   */
  async inquiryAccountBalance(body) {
    return this.request({
      method: 'POST',
      relativeUrl: '/fire/accounts/balance',
      body: JSON.stringify(body),
    });
  }

  /**
   * Provides service to Inquiry Transaction that has been submitted before
   * @param {Object} body - Request body
   * @return {Promise<Object>} Promise resolved with successful action
   */
  async inquiryTransaction(body) {
    return this.request({
      method: 'POST',
      relativeUrl: '/fire/transactions',
      body: JSON.stringify(body),
    });
  }

  /**
   * Provides service for transaction “Cash Transfer” to Non account holder
   * @param {Object} body - Request body
   * @return {Promise<Object>} Promise resolved with successful action
   */
  async cashTransfer(body) {
    return this.request({
      method: 'POST',
      relativeUrl: '/fire/transactions/cash-transfer',
      body: JSON.stringify(body),
    });
  }

  /**
   * Provides service for Amendment “Cash Transfer” to Non account holder
   * @param {Object} body - Request body
   * @return {Promise<Object>} Promise resolved with successful action
   */
  async amendCashTransfer(body) {
    return this.request({
      method: 'PUT',
      relativeUrl: '/fire/transactions/cash-transfer/amend',
      body: JSON.stringify(body),
    });
  }

  /**
   * Provides service for Cancellation “Cash Transfer” to Non account holder
   * @param {Object} body - Request body
   * @return {Promise<Object>} Promise resolved with successful action
   */
  async cancelCashTransfer(body) {
    return this.request({
      method: 'POST',
      relativeUrl: '/fire/transactions/cash-transfer/cancel',
      body: JSON.stringify(body),
    });
  }
}

module.exports = Fire;
