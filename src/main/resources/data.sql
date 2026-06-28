INSERT INTO enduser (username, api_key) VALUES ('alice', 'key-alice-1234');
INSERT INTO enduser (username, api_key) VALUES ('bob', 'key-bob-5678');
INSERT INTO enduser (username, api_key) VALUES ('carol', 'key-carol-9012');

INSERT INTO bank (name, bank_code, url, owner_id) VALUES ('Caixabank', 'CAIX ES BB XXX', 'https://www.caixabank.es/particular/home/particulares_es.html', 1);
INSERT INTO bank (name, bank_code, url, owner_id) VALUES ('BBVA', 'BBVA ES MM XXX', 'https://www.bbva.es/personas.html', 2);
INSERT INTO bank (name, bank_code, url, owner_id) VALUES ('Sabadell', 'BSAB ES BB XXX', 'https://www.bancsabadell.com/bsnacional/es/particulares/', 2);
INSERT INTO bank (name, bank_code, url, owner_id) VALUES ('Santander', 'BSCH ES MM XXX', 'https://www.bancosantander.es/particulares', 3);
INSERT INTO bank (name, bank_code, url, owner_id) VALUES ('Kutxabank', 'CECA ES M2 XXX', 'https://portal.kutxabank.es/cs/Satellite/kb/es/particulares?c=Page&cid=1298547039252&d=Touch&hizkuntza=es&localizador=1298547039252%3B&pagename=PortalBBK%2FPortalKutxabank%2FPage%2FPK_Home&sitio=PortalBBK%2FPortalKutxabankcleaer', 1);

INSERT INTO mortgage (bank_id, name, type, description, TAE) VALUES (1, 'Fixed Mortgage Caixabank', 'FIXED', 'Fixed-rate mortgage with bonus conditions', 2.95);
INSERT INTO mortgage (bank_id, name, type, description, TAE) VALUES (2, 'Variable Mortgage BBVA', 'VARIABLE', 'Variable mortgage linked to Euribor', 3.15);
INSERT INTO mortgage (bank_id, name, type, description, TAE) VALUES (3, 'Fixed Mortgage Sabadell', 'FIXED', 'Bonus fixed mortgage by Sabadell', 3.10);
INSERT INTO mortgage (bank_id, name, type, description, TAE) VALUES (4, 'Youth Mortgage Santander', 'VARIABLE', 'Special mortgage for people under 35', 2.80);
INSERT INTO mortgage (bank_id, name, type, description, TAE) VALUES (5, 'Green Mortgage Kutxabank', 'FIXED', 'Mortgage for energy-efficient homes', 2.90);

-- Seed favourites: alice likes mortgages 1, 4, 5; bob likes 1, 2; carol likes 4, 5
/*
INSERT INTO mortgage_favorite (user_id, mortgage_id) VALUES (1, 0);
INSERT INTO mortgage_favorite (user_id, mortgage_id) VALUES (1, 0);
INSERT INTO mortgage_favorite (user_id, mortgage_id) VALUES (1, 0);
INSERT INTO mortgage_favorite (user_id, mortgage_id) VALUES (2, 0);
INSERT INTO mortgage_favorite (user_id, mortgage_id) VALUES (2, 0);
INSERT INTO mortgage_favorite (user_id, mortgage_id) VALUES (3, 0);
*/