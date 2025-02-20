const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  // Hàm test 1 stock
  test("1 stock", function (done) {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({ stock: "goog" })
      .end(function (err, res) {
        assert.equal(res.body["stockData"]["stock"], "goog");
        assert.isNotNull(res.body["stockData"]["price"]);
        assert.isNotNull(res.body["stockData"]["likes"]);
        done();
      });
  });

  // Hàm test 1 stock với like
  test("1 stock with like", function (done) {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({ stock: "aapl", like: true })
      .end(function (err, res) {
        assert.equal(res.body["stockData"]["stock"], "aapl");
        assert.equal(res.body["stockData"]["likes"], 1);
        done();
      });
  });
  // Hàm test 1 stock với like again
  test("1 stock with like again", function (done) {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({ stock: "aapl", like: true })
      .end(function (err, res) {
        assert.equal(res.body, "Error: Only 1 Like per IP Allowed");
        done();
      });
  });
  //Hàm test 2 stocks
  test("2 stocks", function (done) {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({ stock: ["aapl", "amzn"] })
      .end(function (err, res) {
        let stockData = res.body["stockData"];
        assert.isArray(stockData);
        /* Stocks can come in either order */
        if (stockData[0]["stock"] === "aapl") {
          assert.equal(stockData[0]["stock"], "aapl");
          assert.equal(stockData[0]["likes"], 1);
          assert.equal(stockData[0]["rel_likes"], 1);
          assert.equal(stockData[1]["stock"], "amzn");
          assert.equal(stockData[1]["likes"], 0);
          assert.equal(stockData[1]["rel_likes"], -1);
        } else {
          assert.equal(stockData[1]["stock"], "aapl");
          assert.equal(stockData[1]["likes"], 1);
          assert.equal(stockData[1]["rel_likes"], 1);
          assert.equal(stockData[0]["stock"], "amzn");
          assert.equal(stockData[0]["likes"], 0);
          assert.equal(stockData[0]["rel_likes"], -1);
        }
        done();
      });
  });
  // Hàm test 2 stocks với like
  test("2 stocks with like", function (done) {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({ stock: ["spot", "amzn"], like: true })
      .end(function (err, res) {
        let stockData = res.body.stockData;
        if (stockData[0]["stock"] === "spot") {
          assert.equal(stockData[0]["stock"], "spot");
          assert.equal(stockData[0]["likes"], 1);
          assert.equal(stockData[0]["rel_likes"], 0);
          assert.equal(stockData[1]["stock"], "amzn");
          assert.equal(stockData[1]["likes"], 1);
          assert.equal(stockData[1]["rel_likes"], 0);
        } else {
          assert.equal(stockData[1]["stock"], "spot");
          assert.equal(stockData[1]["likes"], 1);
          assert.equal(stockData[1]["rel_likes"], 0);
          assert.equal(stockData[0]["stock"], "amzn");
          assert.equal(stockData[0]["likes"], 1);
          assert.equal(stockData[0]["rel_likes"], 0);
        }
        done();
      });
  });
});
