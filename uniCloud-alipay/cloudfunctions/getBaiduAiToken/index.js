'use strict';
const axios = require('axios')
const dayjs = require('dayjs')
exports.main = async (event, context) => {
	const db = uniCloud.database();
	const dbCmd = db.command
	let appId = 'pTevytVOtJIT6kXlZrvAPd9T';
	let tokens = await db.collection('baiduToken').where({
		appId
	})
		.get();
	if (tokens.data.length && dayjs().valueOf() < tokens.data[0].expireTimestamp) {
		return {
			access_token: tokens.data[0].access_token
		}
	} else {
		let result = await axios(
			{
				method: "POST",
				url: 'https://aip.baidubce.com/oauth/2.0/token',
				params: {
					grant_type: "client_credentials",
					client_id: appId,
					client_secret: 'vP5peFLTaXTiHEo8brWIcAk6RoU55OH7',
				},
			})
		let res = await db.collection('baiduToken').where({
			appId
		}).remove()
		let tokens = await db.collection('baiduToken')
			.add({
				appId,
				expireTimestamp: dayjs().valueOf() + result.data.expires_in,
				access_token: result.data.access_token
			});
		return {
			access_token: result.data.access_token
		}
	}


};
