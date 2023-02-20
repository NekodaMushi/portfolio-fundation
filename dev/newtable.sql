CREATE TABLE auction (
  auction_id serial PRIMARY KEY,
  token_id int UNIQUE NOT NULL,
  token_contract VARCHAR(42) UNIQUE NOT NULL,
  created_on TIMESTAMP NOT NULL,
  sale_starts TIMESTAMP,
  sale_ends TIMESTAMP,
  blockchain VARCHAR(20) NOT NULL,
  token_standard VARCHAR(8) NOT NULL
);

CREATE TABLE bidder (
  bidder_id serial PRIMARY KEY,
  wallet_id VARCHAR(42) UNIQUE NOT NULL,
  created_on TIMESTAMP NOT NULL
);

CREATE TABLE offer (
  offer_id serial PRIMARY KEY,
  created_on TIMESTAMP NOT NULL,
  auction_id int NOT NULL,
  FOREIGN KEY (auction_id) REFERENCES auction (auction_id) ON DELETE CASCADE,
  bidder_id int NOT NULL,
  FOREIGN KEY (bidder_id) REFERENCES bidder (bidder_id) ON DELETE CASCADE
);

