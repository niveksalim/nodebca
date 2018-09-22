const BCA = require('./bca');

/**
 * BCA GeneralInformation Class
 */
class GeneralInformation extends BCA {
  /**
   * Get information about Foreign Currency Exchange Rate for applicable currencies in BCA. The exchange rate are divide into four types eRate (Electronic Rate), TT (Telegrafic Transfer), TC (Travellers Cheque) and BN (Bank Notes)
   * @param {String[]} param.currencyCodes - List of currency codes to be retrieved
   * @param {String[]} param.rateTypes - List of rate type to be retrieved
   * @return {Promise<Object>} Promise resolved with successful action
   */
  async getForexInfo({
    currencyCodes,
    rateTypes,
  }) {
    const queryParams = [];
    if (currencyCodes && currencyCodes.length) {
      queryParams.push(`CurrencyCode=${currencyCodes.join(',')}`);
    }
    if (rateTypes && rateTypes.length) {
      queryParams.push(`RateType=${rateTypes.join(',')}`);
    }
    const relativeUrl = this.sortQueryParams(`/general/rate/forex?${queryParams.join('&')}`);
    return this.request({
      method: 'GET',
      body: '',
      relativeUrl,
    });
  }

  /**
   * This service offer real-time deposit rate for BCA products
   * @return {Promise<Object>} Promise resolved with successful action
   */
  async getDepositRate() {
    return this.request({
      method: 'GET',
      relativeUrl: '/general/rate/deposit',
      body: '',
    });
  }

  /**
   * This service offer location of nearest BCA’s ATM Locator based current location
   * @param {String} param.searchBy - Use 'Distance'
   * @param {String} param.latitude - Current location’s latitude
   * @param {String} param.longitude - Current location’s longitude
   * @param {String} param.count - Number of ATMs want to be displayed.Max 20, if not entered, will show 10 ATMs
   * @param {String} param.radius - Set maximum distance range to find the closest ATM in meter
   * @return {Promise<Object>} Promise resolved with successful action
   */
  async getATMLocator({
    searchBy,
    latitude,
    longitude,
    count,
    radius,
  }) {
    const queryParams = [
      `SearchBy=${searchBy}`,
      `Latitude=${latitude}`,
      `Longitude=${longitude}`,
      `Radius=${radius}`,
    ]
    if (count) {
      queryParams.push(`Count=${count}`);
    }
    const relativeUrl = this.sortQueryParams(`/general/info-bca/atm?${queryParams.join('&')}`);
    return this.request({
      method: 'GET',
      body: '',
      relativeUrl,
    });
  }

  /**
   * Get information about nearest branch location by distance, address, city or branch type
   * @param {String} param.searchBy - Use 'Distance'
   * @param {String} param.latitude - Current location’s latitude
   * @param {String} param.longitude - Current location’s longitude
   * @param {String} param.count - Number of ATMs want to be displayed.Max 20, if not entered, will show 10 ATMs
   * @param {String} param.radius - Set maximum distance range to find the closest ATM in meter
   * @param {String} param.value - If SearchBy = Address or City, value should be filled in : String;  If SearchBy = Type, value should be filled with: kcu , kcp, e-branch, weekendbanking
   * @return {Promise<Object>} Promise resolved with successful action
   */
  async getBranchLocator({
    searchBy,
    latitude,
    longitude,
    count,
    radius,
    value,
  }) {
    const queryParams = [
      `Latitude=${latitude}`,
      `Longitude=${longitude}`,
    ]
    if (count) {
      queryParams.push(`Count=${count}`);
    }
    if (searchBy) {
      queryParams.push(`SearchBy=${searchBy}`);
    }
    if (radius) {
      queryParams.push(`Radius=${radius}`);
    }
    if (value) {
      queryParams.push(`Value=${value}`);
    }
    const relativeUrl = this.sortQueryParams(`/general/info-bca/branch?${queryParams.join('&')}`);
    return this.request({
      method: 'GET',
      body: '',
      relativeUrl,
    });
  }
}

module.exports = GeneralInformation;
