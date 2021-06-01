-- apply changes
create table account (
  id                            bigserial not null,
  shared_secret                 bytea,
  first_name                    varchar(255) not null,
  last_name                     varchar(255) not null,
  is_paid                       boolean default false not null,
  constraint pk_account primary key (id)
);

create table account_role (
  id                            bigserial not null,
  account_id                    bigint not null,
  role                          varchar(5) not null,
  constraint ck_account_role_role check ( role in ('USER','ADMIN')),
  constraint pk_account_role primary key (id)
);

create table product (
  id                            bigserial not null,
  name                          varchar(255) not null,
  unit                          varchar(255) not null,
  category_id                   bigint not null,
  constraint pk_product primary key (id)
);

create table product_category (
  id                            bigserial not null,
  name                          varchar(255) not null,
  constraint pk_product_category primary key (id)
);

create table share_operation (
  collection                    varchar(255) not null,
  doc_id                        varchar(255) not null,
  version                       integer not null,
  operation                     jsonb not null
);

create table share_snapshot (
  collection                    varchar(255) not null,
  doc_id                        varchar(255) not null,
  doc_type                      varchar(255) not null,
  version                       integer not null,
  data                          jsonb not null
);

create table workspace (
  id                            bigserial not null,
  name                          varchar(255) not null,
  constraint pk_workspace primary key (id)
);

create table workspace_invitation (
  id                            bigserial not null,
  workspace_id                  bigint not null,
  code                          varchar(255) not null,
  is_single_use                 boolean default false not null,
  valid_until                   timestamptz not null,
  constraint pk_workspace_invitation primary key (id)
);

create table workspace_member (
  id                            bigserial not null,
  account_id                    bigint not null,
  workspace_id                  bigint not null,
  is_admin                      boolean default false not null,
  is_creator                    boolean default false not null,
  constraint pk_workspace_member primary key (id)
);

create index ix_account_role_account_id on account_role (account_id);
alter table account_role add constraint fk_account_role_account_id foreign key (account_id) references account (id) on delete restrict on update restrict;

create index ix_product_category_id on product (category_id);
alter table product add constraint fk_product_category_id foreign key (category_id) references product_category (id) on delete restrict on update restrict;

create index ix_workspace_invitation_workspace_id on workspace_invitation (workspace_id);
alter table workspace_invitation add constraint fk_workspace_invitation_workspace_id foreign key (workspace_id) references workspace (id) on delete restrict on update restrict;

create index ix_workspace_member_account_id on workspace_member (account_id);
alter table workspace_member add constraint fk_workspace_member_account_id foreign key (account_id) references account (id) on delete restrict on update restrict;

create index ix_workspace_member_workspace_id on workspace_member (workspace_id);
alter table workspace_member add constraint fk_workspace_member_workspace_id foreign key (workspace_id) references workspace (id) on delete restrict on update restrict;

