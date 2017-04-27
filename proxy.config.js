/**
 * Created by sea35 on 2017/4/27.
 */
'use strict';

const integralHosts="https://www.baidu.com";


const proxy = {
    '/baidu/(.*)': integralHosts,
}


module.exports = proxy;
