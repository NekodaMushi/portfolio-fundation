-- Table: public.auction

-- DROP TABLE IF EXISTS public.auction;

CREATE TABLE IF NOT EXISTS public.auction
(
    auction_id integer NOT NULL DEFAULT nextval('auction_auction_id_seq'::regclass),
    token_id integer NOT NULL,
    created_on timestamp without time zone NOT NULL,
    sale_starts timestamp without time zone,
    sale_ends timestamp without time zone,
    blockchain character varying(20) COLLATE pg_catalog."default" NOT NULL,
    token_standard character varying(8) COLLATE pg_catalog."default" NOT NULL,
    token_contract character varying(42) COLLATE pg_catalog."default" NOT NULL,
    owner_id character varying(42) COLLATE pg_catalog."default" NOT NULL,
    auction_name character varying(16) COLLATE pg_catalog."default" NOT NULL,
    auction_desc character varying(256) COLLATE pg_catalog."default",
    CONSTRAINT auction_pkey PRIMARY KEY (auction_id),
    CONSTRAINT auction_auction_name_key UNIQUE (auction_name),
    CONSTRAINT auction_token_id_key UNIQUE (token_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.auction
    OWNER to postgres;



-- Table: public.bidder

-- DROP TABLE IF EXISTS public.bidder;

CREATE TABLE IF NOT EXISTS public.bidder
(
    bidder_id integer NOT NULL DEFAULT nextval('bidder_bidder_id_seq'::regclass),
    wallet_id character varying(42) COLLATE pg_catalog."default" NOT NULL,
    created_on timestamp without time zone NOT NULL,
    CONSTRAINT bidder_pkey PRIMARY KEY (bidder_id),
    CONSTRAINT bidder_wallet_id_key UNIQUE (wallet_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.bidder
    OWNER to postgres;



-- Table: public.offer

-- DROP TABLE IF EXISTS public.offer;

CREATE TABLE IF NOT EXISTS public.offer
(
    offer_id integer NOT NULL DEFAULT nextval('offer_offer_id_seq'::regclass),
    created_on timestamp without time zone NOT NULL,
    auction_id integer NOT NULL,
    bidder_id integer NOT NULL,
    offer_value real NOT NULL,
    CONSTRAINT offer_pkey PRIMARY KEY (offer_id),
    CONSTRAINT offer_auction_id_fkey FOREIGN KEY (auction_id)
        REFERENCES public.auction (auction_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT offer_bidder_id_fkey FOREIGN KEY (bidder_id)
        REFERENCES public.bidder (bidder_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.offer
    OWNER to postgres;
