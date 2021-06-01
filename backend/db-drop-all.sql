alter table congo drop constraint if exists fk_congo_account_id;
drop index if exists ix_congo_account_id;

drop table if exists account;

drop table if exists congo;

