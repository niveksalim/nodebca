const expect = require('chai').expect;
const {
  forEach,
  cloneDeep,
} = require('lodash');
const {
  format,
  addDays,
} = require('date-fns');
const BCA = require('../lib/bca');
const BusineesBanking = require('../lib/business_banking');
const Fire = require('../lib/fire');
const Sakuku = require('../lib/sakuku');
const GeneralInfo = require('../lib/general_information');
const VirtualAccount = require('../lib/virtual_account');
const originalConfig = {
  api_host: 'https://sandbox.bca.co.id',
  api_port: 443,
  client_id: 'xxx',
  client_secret: 'xxx',
  api_key: 'xxx',
  api_secret: 'xxx',
  origin: 'https://github.com',
};

describe('BCA Node Wrapper Tests', () => {
  let bca;
  let businessBanking;
  let fire;
  let sakuku;
  let generalInfo;
  let virtualAccount;
  let config;

  beforeEach(() => {
    config = cloneDeep(originalConfig);
    businessBanking = new BusineesBanking(config);
    bca = new BCA(config);
    fire = new Fire(config);
    sakuku = new Sakuku(config);
    generalInfo = new GeneralInfo(config);
    virtualAccount = new VirtualAccount(config);
  });

  describe('BCA', () => {
    describe('getToken', () => {
      it('successfully to get the token', async () => {
        const token = await bca.getToken();
        expect(token).to.have.property('access_token');
        expect(token).to.have.property('token_type');
        expect(token).to.have.property('expires_in');
        expect(token).to.have.property('scope');
      });
  
      it('fails to get token using incorrect client_id', async () => {
        config.client_id = 'xxx';
        bca.clearTokenCache();
        const token = await bca.getToken();
        expect(token).to.have.property('ErrorCode');
        expect(token.ErrorCode).to.equal('ESB-14-008');
        expect(token).to.have.property('ErrorMessage');
      });
  
      it('fails to get token using incorrect client_secret', async () => {
        config.client_secret = 'xxx';
        bca.clearTokenCache();
        const token = await bca.getToken();
        expect(token).to.have.property('ErrorCode');
        expect(token.ErrorCode).to.equal('ESB-14-008');
        expect(token).to.have.property('ErrorMessage');
      });
    });
  });

  describe('Fire', () => {
    it('successfully transfers to BCA account', async () => {
      const transfer = await fire.transfer({
        'Authentication': {
            'CorporateID': '123456',
            'AccessCode': 'FcgrR21fkzjE7GpuH2Eb',
            'BranchCode': '12345678',
            'UserID': 'DUMMYIDO001',
            'LocalID': 'QWERTY54321'		
        },
        'SenderDetails': {
            'FirstName': 'MG',
            'LastName': '',
            'DateOfBirth': '',
            'Address1': 'skgknp',
            'Address2': '',
            'City': 'India',
            'StateID': '',
            'PostalCode': '',
            'CountryID': 'US',
            'Mobile': '',
            'IdentificationType': '',
            'IdentificationNumber': '',
            'AccountNumber': ''
        },
        'BeneficiaryDetails': {
            'Name': 'monica gupt',
            'DateOfBirth': '',
            'Address1': '',
            'Address2': '',
            'City': '',
            'StateID': '',
            'PostalCode': '',
            'CountryID': 'ID',
            'Mobile': '',
            'IdentificationType': '',
            'IdentificationNumber': '',
            'NationalityID': '',
            'Occupation': '',
            'BankCodeType': 'BIC',
            'BankCodeValue': '260544  XXX',
            'BankCountryID': 'ID',
            'BankAddress': '',
            'BankCity': '',
            'AccountNumber': '0106666011'
        },
        'TransactionDetails': {
            'CurrencyID': 'IDR',
            'Amount': '10000000',
            'PurposeCode': '011',
            'Description1': '',
            'Description2': '',
            'DetailOfCharges': 'SHA',
            'SourceOfFund': '',
            'FormNumber': '7632605701245868'
        }
      });
      expect(transfer).to.have.property('BeneficiaryDetails');
      expect(transfer).to.have.property('TransactionDetails');
      expect(transfer).to.have.property('StatusTransaction');
      expect(transfer.StatusTransaction).to.equal('0000');
      expect(transfer).to.have.property('StatusMessage');
      expect(transfer.StatusMessage).to.equal('Success');
    });

    it('fails to transfer as account is closed', async () => {
      const transfer = await fire.transfer({
        'Authentication': {
            'CorporateID': '123456',
            'AccessCode': 'FcgrR21fkzjE7GpuH2Eb',
            'BranchCode': '12345678',
            'UserID': 'DUMMYIDO001',
            'LocalID': 'QWERTY54321'		
        },
        'SenderDetails': {
            'FirstName': 'MG',
            'LastName': '',
            'DateOfBirth': '',
            'Address1': 'skgknp',
            'Address2': '',
            'City': 'India',
            'StateID': '',
            'PostalCode': '',
            'CountryID': 'US',
            'Mobile': '',
            'IdentificationType': '',
            'IdentificationNumber': '',
            'AccountNumber': ''
        },
        'BeneficiaryDetails': {
            'Name': 'monica gupt',
            'DateOfBirth': '',
            'Address1': '',
            'Address2': '',
            'City': '',
            'StateID': '',
            'PostalCode': '',
            'CountryID': 'ID',
            'Mobile': '',
            'IdentificationType': '',
            'IdentificationNumber': '',
            'NationalityID': '',
            'Occupation': '',
            'BankCodeType': 'BIC',
            'BankCodeValue': '260544  XXX',
            'BankCountryID': 'ID',
            'BankAddress': '',
            'BankCity': '',
            'AccountNumber': '0106667011'
        },
        'TransactionDetails': {
            'CurrencyID': 'IDR',
            'Amount': '10000000',
            'PurposeCode': '011',
            'Description1': '',
            'Description2': '',
            'DetailOfCharges': 'SHA',
            'SourceOfFund': '',
            'FormNumber': '7632605701245868'
        }
      });
      expect(transfer).to.have.property('ErrorCode').and.equal('0409');
    });

    it('fails to transfer as account is invalid', async () => {
      const transfer = await fire.transfer({
        'Authentication': {
            'CorporateID': '123456',
            'AccessCode': 'FcgrR21fkzjE7GpuH2Eb',
            'BranchCode': '12345678',
            'UserID': 'DUMMYIDO001',
            'LocalID': 'QWERTY54321'		
        },
        'SenderDetails': {
            'FirstName': 'MG',
            'LastName': '',
            'DateOfBirth': '',
            'Address1': 'skgknp',
            'Address2': '',
            'City': 'India',
            'StateID': '',
            'PostalCode': '',
            'CountryID': 'US',
            'Mobile': '',
            'IdentificationType': '',
            'IdentificationNumber': '',
            'AccountNumber': ''
        },
        'BeneficiaryDetails': {
            'Name': 'monica gupt',
            'DateOfBirth': '',
            'Address1': '',
            'Address2': '',
            'City': '',
            'StateID': '',
            'PostalCode': '',
            'CountryID': 'ID',
            'Mobile': '',
            'IdentificationType': '',
            'IdentificationNumber': '',
            'NationalityID': '',
            'Occupation': '',
            'BankCodeType': 'BIC',
            'BankCodeValue': '260544  XXX',
            'BankCountryID': 'ID',
            'BankAddress': '',
            'BankCity': '',
            'AccountNumber': '0012323008'
        },
        'TransactionDetails': {
            'CurrencyID': 'IDR',
            'Amount': '10000000',
            'PurposeCode': '011',
            'Description1': '',
            'Description2': '',
            'DetailOfCharges': 'SHA',
            'SourceOfFund': '',
            'FormNumber': '7632605701245868'
        }
      });
      expect(transfer).to.have.property('ErrorCode').and.equal('0406');
    });

    it('successfully inquiring an account', async () => {
      const transfer = await fire.inquiryAccount({
        'Authentication': {
          'CorporateID': '123456',
          'AccessCode': 'Kw5oTuF12dseSH44Y8ww',
          'BranchCode': 'BCA001',
          'UserID': 'BCAUSERID',
          'LocalID': '40115',
        },
        'BeneficiaryDetails': {
          'BankCodeType': 'BIC',
          'BankCodeValue': 'CENAIDJAXXX',
          'AccountNumber': '0106666011',
        }
      });
      expect(transfer).to.have.property('BeneficiaryDetails');
      expect(transfer).to.have.property('StatusTransaction');
      expect(transfer.StatusTransaction).to.equal('0000');
      expect(transfer).to.have.property('StatusMessage');
      expect(transfer.StatusMessage).to.equal('Success');
    });

    it('successfully inquiring an account balance', async () => {
      const transfer = await fire.inquiryAccountBalance({
        'Authentication': {
          'CorporateID': '123456',
          'AccessCode': 'Kw5oTuF12dseSH44Y8ww',
          'BranchCode': '12345678',
          'UserID': 'BCAUSERID',
          'LocalID': '40115',
        },
        'FIDetails': {
          'AccountNumber': '0012323008',
        },
      });
      expect(transfer).to.have.property('FIDetails');
      expect(transfer).to.have.property('StatusTransaction');
      expect(transfer.StatusTransaction).to.equal('0000');
      expect(transfer).to.have.property('StatusMessage');
      expect(transfer.StatusMessage).to.equal('Success');
    });

    it('successfully inquiring a transaction', async () => {
      const transfer = await fire.inquiryTransaction({
        'Authentication': {
          'CorporateID': '123456',
          'AccessCode': 'Kw5oTuFiR1WbSH44Y8ww',
          'BranchCode': 'BCA001',
          'UserID': 'BCAUSERID001',
          'LocalID': '40115',
        },
        'TransactionDetails': {
          'InquiryBy': 'N',
          'InquiryValue': '0247986325',
        },
      });
      expect(transfer).to.have.property('SenderDetails');
      expect(transfer).to.have.property('BeneficiaryDetails');
      expect(transfer).to.have.property('TransactionDetails');
      expect(transfer).to.have.property('StatusTransaction');
      expect(transfer.StatusTransaction).to.equal('0001');
      expect(transfer).to.have.property('StatusMessage');
    });

    it('successfully sent to another bank', async () => {
      const transfer = await fire.inquiryTransaction({
        'Authentication': {
          'CorporateID': '123456',
          'AccessCode': 'Kw5oTuFiR1WbSH44Y8ww',
          'BranchCode': 'BCA001',
          'UserID': 'BCAUSERID001',
          'LocalID': '40115',
        },
        'TransactionDetails': {
          'InquiryBy': 'N',
          'InquiryValue': '0247986326',
        },
      });
      expect(transfer).to.have.property('SenderDetails');
      expect(transfer).to.have.property('BeneficiaryDetails');
      expect(transfer).to.have.property('TransactionDetails');
      expect(transfer).to.have.property('StatusTransaction');
      expect(transfer.StatusTransaction).to.equal('0002');
      expect(transfer).to.have.property('StatusMessage');
    });

    it('success as status is "Ready to Encash"', async () => {
      const transfer = await fire.inquiryTransaction({
        'Authentication': {
          'CorporateID': '123456',
          'AccessCode': 'Kw5oTuFiR1WbSH44Y8ww',
          'BranchCode': 'BCA001',
          'UserID': 'BCAUSERID001',
          'LocalID': '40115',
        },
        'TransactionDetails': {
          'InquiryBy': 'N',
          'InquiryValue': '0247986327',
        },
      });
      expect(transfer).to.have.property('SenderDetails');
      expect(transfer).to.have.property('BeneficiaryDetails');
      expect(transfer).to.have.property('TransactionDetails');
      expect(transfer).to.have.property('StatusTransaction');
      expect(transfer.StatusTransaction).to.equal('0003');
      expect(transfer).to.have.property('StatusMessage');
    });

    it('success as status is "Already Encash"', async () => {
      const transfer = await fire.inquiryTransaction({
        'Authentication': {
          'CorporateID': '123456',
          'AccessCode': 'Kw5oTuFiR1WbSH44Y8ww',
          'BranchCode': 'BCA001',
          'UserID': 'BCAUSERID001',
          'LocalID': '40115',
        },
        'TransactionDetails': {
          'InquiryBy': 'N',
          'InquiryValue': '0247986328',
        },
      });
      expect(transfer).to.have.property('SenderDetails');
      expect(transfer).to.have.property('BeneficiaryDetails');
      expect(transfer).to.have.property('TransactionDetails');
      expect(transfer).to.have.property('StatusTransaction');
      expect(transfer.StatusTransaction).to.equal('0005');
      expect(transfer).to.have.property('StatusMessage');
    });

    it('successfully to perform cash transfer', async () => {
      const transfer = await fire.cashTransfer({
        'Authentication': {
          'CorporateID': '123456',
          'AccessCode': 'Kw5oTu5th6SH44Y8ww',
          'BranchCode': 'BCA001',
          'UserID': 'BCAUSERID001',
          'LocalID': '40115'
        },
        'SenderDetails': {
          'FirstName': 'BLUMA',
          'LastName': 'PINTO',
          'DateOfBirth': '',
          'Address1': 'DUBAI',
          'Address2': '',
          'City': 'DUBAI',
          'StateID': '',
          'PostalCode': '',
          'CountryID': 'AE',
          'Mobile': '',
          'IdentificationType': '',
          'IdentificationNumber': '',
        },
        'BeneficiaryDetails': {
          'Name': 'TEST',
          'DateOfBirth': '',
          'Address1': 'Dubai',
          'Address2': '',
          'City': 'DUBAI',
          'StateID': 'ID',
          'PostalCode': '',
          'CountryID': 'ID',
          'Mobile': '6212365478922',
          'IdentificationType': '',
          'IdentificationNumber': '',
          'NationalityID': '',
          'Occupation': '',
        },
        'TransactionDetails': {
          'PIN': '477634423',
          'SecretQuestion': '',
          'SecretAnswer': '',
          'CurrencyID': 'IDR',
          'Amount': '150000.00',
          'PurposeCode': '030',
          'Description1': '',
          'Description2': '',
          'DetailOfCharges': 'OUR',
          'SourceOfFund': 'Money transfer for family needs.',
          'FormNumber': '477634423',
        },
      });
      expect(transfer).to.have.property('BeneficiaryDetails');
      expect(transfer).to.have.property('TransactionDetails');
      expect(transfer).to.have.property('StatusTransaction');
      expect(transfer.StatusTransaction).to.equal('0003');
      expect(transfer).to.have.property('StatusMessage');
    });

    it('successfully to amend cash transfer', async () => {
      const transfer = await fire.amendCashTransfer({
        'Authentication': {
          'CorporateID': '123456',
          'AccessCode': 'k1oawj8tygkrY9tBVkt',
          'BranchCode': 'BCAAPI01',
          'UserID': 'BCAUSERID001',
          'LocalID': 'BCA01',
        },
        'AmendmentDetails':{
          'SenderDetails': {
            'FirstName': 'ERIK HERNANDEZ CORTES',
            'LastName': '',
            'DateOfBirth': '',
            'Address1': '4TH AVENUE MANHATTAN',
            'Address2': '',
            'City': 'NEW YORK',
            'StateID': '',
            'PostalCode': '',
            'CountryID': 'US',
            'Mobile': '',
            'IdentificationType': '',
            'IdentificationNumber': '',
          },
          'BeneficiaryDetails': {
            'Name': 'ADRIANA PEREZ ENRRIQUEZ',
            'DateOfBirth': '',
            'Address1': 'MAIN STREET 512',
            'Address2': '',
            'City': '',
            'StateID': '',
            'PostalCode': '',
            'CountryID': 'ID',
            'Mobile': '',
            'IdentificationType': '',
            'IdentificationNumber': '',
            'NationalityID': '',
            'Occupation': '',
          },
          'TransactionDetails':{ 
            'SecretQuestion': '',
            'SecretAnswer': '',
            'Description1': '',
            'Description2': '',
          }
        },
        'TransactionDetails': {
          'FormNumber': 'CT293 IDR2D',
        },
      });
      expect(transfer).to.have.property('SenderDetails');
      expect(transfer).to.have.property('BeneficiaryDetails');
      expect(transfer).to.have.property('TransactionDetails');
      expect(transfer).to.have.property('StatusTransaction');
      expect(transfer.StatusTransaction).to.equal('0000');
      expect(transfer).to.have.property('StatusMessage');
    });

    it('successfully to cancel cash transfer', async () => {
      const transfer = await fire.cancelCashTransfer({
        'Authentication': {
          'CorporateID': '123456',
          'AccessCode': 'k6re8tG35hgNODSg3Y',
          'BranchCode': 'BCA01',
          'UserID': 'BCAUSERID001',
          'LocalID': '40115',
        },
        'TransactionDetails': {
          'FormNumber': 'CT293 IDR2D',
          'Amount': '9350000.00',
          'CurrencyID': 'IDR',
        },
      });
      expect(transfer).to.have.property('StatusTransaction');
      expect(transfer.StatusTransaction).to.equal('0000');
      expect(transfer).to.have.property('StatusMessage');
    });
  });

  describe('Sakuku', () => {
    it('succesfully to create payment', async () => {
      const result = await sakuku.createPayment({
        'MerchantID': '89000',
        'MerchantName': 'Merchant One',
        'Amount': '100.22',
        'Tax': '0.0',
        'TransactionID': '156479',  
        'CurrencyCode': 'IDR',
        'ReferenceID': '123465798',
      });
      expect(result).to.have.property('TransactionID');
      expect(result).to.have.property('PaymentID');
      expect(result).to.have.property('LandingPageURL');
    });

    it('succesfully to get payment status', async () => {
      const result = await sakuku.paymentStatus({
        merchantId: '89000',
        paymentId: '0FE117D539DF610FE0540021281A5568',
      });
      expect(result).to.have.property('PaymentID');
      expect(result).to.have.property('Amount');
      expect(result).to.have.property('PaymentStatus');
      expect(result).to.have.property('ReasonStatus');
    });
  });

  describe('GeneralInfo', () => {
    it('succesfully to retrieve forex info', async () => {
      const result = await generalInfo.getForexInfo({
        currencyCodes: ['USD', 'AUD'],
        rateTypes: ['erate', 'tt'],
      });
      expect(result).to.have.property('Currencies').to.have.length(2);
      expect(result).to.have.property('InvalidRateType');
      expect(result).to.have.property('InvalidCurrencyCode');
    });

    it('succesfully to get deposit rate', async () => {
      const result = await generalInfo.getDepositRate();
      expect(result).to.have.property('Date');
      expect(result).to.have.property('Description1');
      expect(result).to.have.property('OutputData');
    });

    it('succesfully to get nearest ATM location', async () => {
      const result = await generalInfo.getATMLocator({
        searchBy: 'Distance',
        latitude: '-6.1900718',
        longitude: '106.797190',
        count: '3',
        radius: '20',
      });
      expect(result).to.have.property('ATMDetails');
    });

    it('succesfully to get nearest Branch location', async () => {
      const result = await generalInfo.getBranchLocator({
        latitude: '-6.1900718',
        longitude: '106.797190',
      });
      expect(result).to.have.property('BranchDetails');
    });
  });

  describe('VirtualAccount', () => {
    it('succesfully to inquire payment status (by request id)', async () => {
      const result = await virtualAccount.inquryStatusPayment({
        companyCode: '10111',
        requestId: '201711101617000000700000000001',
      });
      expect(result).to.have.property('TransactionData');
    });

    it('succesfully to inquire payment status (by customer number)', async () => {
      const result = await virtualAccount.inquryStatusPayment({
        companyCode: '10111',
        customerNumber: '12345',
      });
      expect(result).to.have.property('TransactionData');
    });
  });

  describe('BusineesBanking', () => {
    describe('getBalance', () => {
      it('succesfully fetches balance', async () => {
        const balances = await businessBanking.getBalance({
          corporateId: 'BCAAPI2016',
          accountNumbers: ['0201245680'],
        });
        expect(balances).to.have.property('AccountDetailDataSuccess');
        expect(balances.AccountDetailDataSuccess.length).to.equal(1);
        forEach(balances.AccountDetailDataSuccess.length, (balance) => {
          expect(balance).to.have.property('AccountNumber');
          expect(balance).to.have.property('Currency');
          expect(balance).to.have.property('Balance');
          expect(balance).to.have.property('AvailableBalance');
          expect(balance).to.have.property('FloatAmount');
          expect(balance).to.have.property('HoldAmount');
          expect(balance).to.have.property('Plafon');
        });
        expect(balances).to.have.property('AccountDetailDataFailed');
        expect(balances.AccountDetailDataFailed.length).to.have.equal(0);
      });
  
      it('fails when using incorrect timestamp format', async () => {
        config.timestampFormat = 'YYYY-MM-DD';
        const balances = await businessBanking.getBalance({
          corporateId: 'BCAAPI2016',
          accountNumbers: ['0201245680'],
        });
        expect(balances).to.have.property('ErrorCode');
        expect(balances.ErrorCode).to.equal('ESB-14-003');
        expect(balances).to.have.property('ErrorMessage');
      });
    });

    describe('getAccountStatement', () => {
      it('succesfully fetches account statement', async () => {
        const accountStatement = await businessBanking.getAccountStatement({
          corporateId: 'BCAAPI2016',
          accountNumber: '0201245680',
          startDate: new Date(2016, 7, 29),
          endDate: new Date(2016, 8, 1),
        });
        expect(accountStatement).to.have.property('StartDate');
        expect(accountStatement.StartDate).to.equal('2016-08-29');
        expect(accountStatement).to.have.property('EndDate');
        expect(accountStatement.EndDate).to.equal('2016-09-01');
        expect(accountStatement).to.have.property('Currency');
        expect(accountStatement).to.have.property('StartBalance');
        expect(accountStatement).to.have.property('Data');
        forEach(accountStatement.Data, (data) => {
          expect(data).to.have.property('TransactionDate');
          expect(data).to.have.property('BranchCode');
          expect(data).to.have.property('TransactionType');
          expect(data).to.have.property('TransactionAmount');
          expect(data).to.have.property('TransactionName');
          expect(data).to.have.property('Trailer');
        });
      });
  
      it('fails to fetch account statement for more than 31 days', async () => {
        const accountStatement = await businessBanking.getAccountStatement({
          corporateId: 'BCAAPI2016',
          accountNumber: '0201245680',
          startDate: new Date(2016, 6, 29),
          endDate: new Date(2016, 8, 1),
        });
        expect(accountStatement).to.have.property('ErrorCode');
        expect(accountStatement.ErrorCode).to.equal('ESB-99-158');
      });
  
      it('fails to fetch account statement with invalid corporateId', async () => {
        const accountStatement = await businessBanking.getAccountStatement({
          corporateId: 'BCAAPI2116',
          accountNumber: '0201245680',
          startDate: new Date(2016, 7, 29),
          endDate: new Date(2016, 8, 1),
        });
        expect(accountStatement).to.have.property('ErrorCode');
        expect(accountStatement.ErrorCode).to.equal('ESB-82-002');
      });
  
      it('fails to fetch account statement with invalid accountNumber', async () => {
        const accountStatement = await businessBanking.getAccountStatement({
          corporateId: 'BCAAPI2016',
          accountNumber: '0201245698',
          startDate: new Date(2016, 7, 29),
          endDate: new Date(2016, 8, 1),
        });
        expect(accountStatement).to.have.property('ErrorCode');
        expect(accountStatement.ErrorCode).to.equal('ESB-99-156');
      });
    });

    describe('corporateTransfer', () => {
      it('succesfully sent transaction', async () => {
        const transfer = await businessBanking.corporateTransfer({
          CorporateID: 'BCAAPI2016',
          SourceAccountNumber : '0201245680',
          TransactionID : '00000001',
          ReferenceID : '12345/PO/2016',
          CurrencyCode : 'IDR',
          Amount : '100000.00',
          BeneficiaryAccountNumber : '0201245681',
          Remark1 : 'Transfer Test',
          Remark2 : 'Online Transfer',
        });
        expect(transfer).to.have.property('TransactionID');
        expect(transfer).to.have.property('TransactionDate');
        expect(transfer).to.have.property('ReferenceID');
        expect(transfer).to.have.property('Status');
        expect(transfer.Status).to.equal('Success');
      });
    });
  });
});