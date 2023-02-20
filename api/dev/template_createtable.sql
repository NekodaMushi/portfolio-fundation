-- DROP TABLE IF EXISTS public."Offers";

CREATE TABLE IF NOT EXISTS public."Offers"
(
    bidderid integer NOT NULL,
    CONSTRAINT "Offers_pkey" PRIMARY KEY (bidderid)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Offers"
    OWNER to postgres;

    -- DROP TABLE IF EXISTS public.auction;

CREATE TABLE IF NOT EXISTS public.auction
(
    audtionid integer NOT NULL DEFAULT nextval('auction_audtionid_seq'::regclass),
    tokenid character varying COLLATE pg_catalog."default" NOT NULL,
    description character varying COLLATE pg_catalog."default",
    CONSTRAINT auction_pkey PRIMARY KEY (audtionid)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.auction
    OWNER to postgres;

