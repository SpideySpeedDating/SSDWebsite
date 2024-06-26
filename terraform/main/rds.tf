module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "6.5.2"

  identifier = "spideyspeeddatingdb"

  family               = "postgres16"
  major_engine_version = "16"
  engine               = "postgres"
  engine_version       = "16"

  instance_class      = "db.t3.micro"
  create_db_instance  = true
  allocated_storage   = 10
  deletion_protection = false
  skip_final_snapshot = true

  db_subnet_group_name   = module.vpc.database_subnet_group_name
  vpc_security_group_ids = [module.vpc_sg.security_group_id]
  publicly_accessible    = true

  db_name                     = "spideyspeeddatingdb"
  username                    = "dbadmin"
  port                        = "5432"
  manage_master_user_password = true
}