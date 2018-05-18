"use strict";
/*tslint:disable:no-unused-expression*/
/*tslint:disable:max-line-length*/

import { expect } from "chai";
import * as utils from "../../src/utils";

describe("crypto", () => {

  it("empty Hash", () => {
    expect(utils.hash(new Buffer([]))).to.be.equal("0x0e5751c026e543b2e8ab2eb06099daa1d1e5df47778f7787faab45cdf12fe3a8");
  });

  it("crypto sign", () => {
    const ret = utils.sign(Buffer.from("0e5751c026e543b2e8ab2eb06099daa1d1e5df47778f7787faab45cdf12fe3a8", "hex"), Buffer.from("dce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65", "hex"));
    expect(ret).to.be.equal("0x5cd560e88ec0826e1ac23da7e5309dc52bc894d5512b3aa34c7c369b251fcc797c20ea9dbc5513e3a47229cc2de5d544560af80a6b3b9ae8b167cad87c8d1ff501");
  });

  it("crypto recover", () => {
    const ret = utils.recover(Buffer.from("0e5751c026e543b2e8ab2eb06099daa1d1e5df47778f7787faab45cdf12fe3a8", "hex"), Buffer.from("5cd560e88ec0826e1ac23da7e5309dc52bc894d5512b3aa34c7c369b251fcc797c20ea9dbc5513e3a47229cc2de5d544560af80a6b3b9ae8b167cad87c8d1ff501", "hex"));
    expect(ret).to.be.equal("0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed");
  });

});
