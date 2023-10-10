DROP TABLE IF EXISTS public.PuiStoUserAccount CASCADE;
DROP SEQUENCE IF EXISTS PuiStoUserSeq;

DROP TABLE IF EXISTS public.PuiStoStorageTable CASCADE;
DROP SEQUENCE IF EXISTS PuiStoStorageSeq;

DROP TABLE IF EXISTS public.tokensession CASCADE;

DROP TABLE IF EXISTS public. CASCADE;

CREATE TABLE public.PuiStoUserAccount (
    userAccountName text NOT NULL,
    userId text NOT NULL,
    userPassword text NOT NULL,
    userNumber text NOT NULL,
    userFirstName text NOT NULL,
    userLastName text NOT NULL,
    userSelectedPlan bigint NOT NULL,
    id bigint NOT NULL,
    PRIMARY KEY (id)
) WITHOUT OIDS;


CREATE  SEQUENCE PuiStoUserSeq;

CREATE TABLE public.PuiStoStorageTable (
    directoryName text NOT NULL,
    id bigint NOT NULL,
    parentDirectory text,
    directoryType text NOT NULL,
    extension text NOT NULL,
    userId bigint NOT NULL,
    convertedDirectoryName text NOT NULL,
    fileSize bigint NOT NULL,
    fileType text NOT NULL,
    inRubbish boolean NOT NULL,
    creation timestamp without time zone NOT NULL,
    modification timestamp without time zone NOT NULL,
    version bigint NOT NULL,
    starItem boolean NOT NULL,
    formattedFileSize text NOT NULL,
    mimeType text NOT NULL,
    PRIMARY KEY (id)
) WITHOUT OIDS;


CREATE  SEQUENCE PuiStoStorage;

CREATE TABLE public.tokensession (
    fkUserAccount bigint NOT NULL,
    token text NOT NULL,
    expiration timestamp without time zone NOT NULL
) WITHOUT OIDS;

ALTER TABLE public.tokensession
    ADD UNIQUE (token);

CREATE TABLE public. (
) WITHOUT OIDS;