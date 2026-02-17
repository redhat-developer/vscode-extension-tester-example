// increase default test case timeout to 5 seconds
module.exports = {
	timeout: 5000,
	reporter: 'json',
    'reporter-option': {
        output: './reports/ui-test-results.json'
    }
};
