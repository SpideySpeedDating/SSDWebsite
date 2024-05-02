module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.5.3"

  name = "main-vpc"
  cidr = "10.0.0.0/16"

  azs              = ["eu-west-1a", "eu-west-1b"]
  private_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets   = ["10.0.101.0/24", "10.0.102.0/24"]
  database_subnets = ["10.0.201.0/24", "10.0.202.0/24"]

  create_database_subnet_group           = true
  create_database_subnet_route_table     = true
  create_database_internet_gateway_route = true
  database_subnet_group_name             = "db-subnet-group"

  enable_dns_hostnames = true
  enable_dns_support   = true
}

module "vpc_sg" {
  source = "terraform-aws-modules/security-group/aws"

  name              = "spidey-speed-dating-sg"
  vpc_id            = module.vpc.vpc_id
  security_group_id = module.vpc.default_security_group_id

  ingress_with_cidr_blocks = [
    {
      from_port   = 5432
      to_port     = 5432
      protocol    = "tcp"
      description = "Spidey Speed Dating DB Port"
      cidr_blocks = "0.0.0.0/0"
    },
    {
      from_port   = 22
      to_port     = 22
      protocol    = "tcp"
      description = "Spidey Speed Dating SSH TCP"
      cidr_blocks = "0.0.0.0/0"
    },
    {
      from_port   = 80
      to_port     = 80
      protocol    = "tcp"
      description = "Spidey Speed Dating HTTP Port"
      cidr_blocks = "0.0.0.0/0"
    },
    {
      from_port   = 443
      to_port     = 443
      protocol    = "tcp"
      description = "Spidey Speed Dating HTTPS Port"
      cidr_blocks = "0.0.0.0/0"
    }
  ]
  egress_with_cidr_blocks = [
    {
      from_port   = 0
      to_port     = 0
      protocol    = "-1"
      description = "All traffic"
      cidr_blocks = "0.0.0.0/0"
    }
  ]
}