create table account (
  id                            bigint auto_increment not null,
  name                          varchar(255),
  constraint pk_account primary key (id)
);

create table congo (
  id                            bigint auto_increment not null,
  account_id                    bigint not null,
  score                         integer not null,
  constraint pk_congo primary key (id)
);

create index ix_congo_account_id on congo (account_id);
alter table congo add constraint fk_congo_account_id foreign key (account_id) references account (id) on delete restrict on update restrict;

