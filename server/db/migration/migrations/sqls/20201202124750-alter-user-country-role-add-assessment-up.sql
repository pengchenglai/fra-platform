
alter table user_country_role add assessment assessment_type;

UPDATE user_country_role
SET assessment = 'fra2020';
