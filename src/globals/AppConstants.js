import {displayName as appName} from '../../app.json';

module.exports = {
    APP_NAME: appName,
    //BASE_URL: "http://angelworkplace.com/home_cleaning/",
    API: {
        LOGIN_MODEL: 'res.partner',
    },
    /*Odoo: {
        host: '192.168.0.131',
        port: 8069, /!* Defaults to 80 if not specified *!/
        database: 'partner',
        username: 'admin', /!* Optional if using a stored session_id *!/
        password: 'a', /!* Optional if using a stored session_id *!/
        sid: '', /!* Optional if using username/password *!/
        protocol: 'http' /!* Defaults to http if not specified *!/
    },*/

    Odoo: {
        host: '103.138.233.100',  //103.78.207.222
        port: 8833, /* Defaults to 80 if not specified */
        database: 'kbz_foods_v12c_001',
        username: 'admin', /* Optional if using a stored session_id */
        password: 'a', /* Optional if using a stored session_id */
        sid: '', /* Optional if using username/password */
        protocol: 'http' /* Defaults to http if not specified */
    },
    SCREEN_TITLE: {
        LOGIN: "LOGIN"
    },
    IMAGES: {
        PLACE_HOLDER_USER: require('../assets/images/user.jpg')
    },
    DEFAULT_TOUCH_DELAY: 200,
    USER_LOGIN_STATUS: {
        NEW: 'new',
        VERIFIED: 'verified',
        CANCELLED: 'cancelled'
    }
}