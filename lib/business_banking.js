const {
  format,
  addDays,
} = require('date-fns');
const util = require('lodash');
const BCA = require('./bca');

/**
 * BCA BusinessBanking Class
 */
class BusinessBanking extends BCA {

  /**
   * Get KlikBCA Bisnis account balance information with maximum of 20 accounts in a request
   * @param {String} param.corporateId - KlikBCA Bisnis Corporate ID
   * @param {Object[]} param.accountNumbers - Account(s) Number
   * @return {Promise<Object>} Promise resolved with the balance
   */
  async getBalance({
    corporateId,
    accountNumbers = [],
  }) {
    const relativeUrl = `/banking/v3/corporates/${corporateId}/accounts/${accountNumbers.join(',')}`;
    return this.request({
      method: 'GET',
      body: '',
      relativeUrl,
    });
  }

  /**
   * Get KlikBCA Bisnis account statement
   * @param {String} params.corporateId - KlikBCA Bisnis CorporateID
   * @param {String} params.accountNumber - KlikBCA Bisnis AccountNumber
   * @param {String} params.startDate - Statement start date
   * @param {String} params.endDate - Statement end date
   * @return {Promise<Object>} Promise resolved with the account statement
   */
  async getAccountStatement({
    corporateId,
    accountNumber,
    startDate = new Date(),
    endDate = new Date(),
  }) {
    const dateFormat = 'YYYY-MM-DD';
    const relativeUrl = this.sortQueryParams(`/banking/v3/corporates/${corporateId}/accounts/${accountNumber}/statements?StartDate=${format(startDate, dateFormat)}&EndDate=${format(endDate, dateFormat)}`);
    return this.request({
      method: 'GET',
      body: '',
      relativeUrl,
    });
  }

  /**
   * Corporate transfer within BCA
   * @param {Object} body - request body
   * @return {Promise} Promise resolved with transaction is successfully sent or not
   */
  async corporateTransfer(body) {
    const payload = {
      ...body,
      TransactionDate: format(new Date(), 'YYYY-MM-DD'),
    };
    const response = await this.request({
      method: 'POST',
      body: JSON.stringify(payload),
      relativeUrl: '/banking/corporates/transfers',
    });
    if (response.ErrorCode === 'ESB-82-007') {
      payload.TransactionDate = format(addDays(new Date(), 1), 'YYYY-MM-DD');
    }
    return this.request({
      method: 'POST',
      body: JSON.stringify(payload),
      relativeUrl: '/banking/corporates/transfers',
    });
  }
}

module.exports = BusinessBanking;
