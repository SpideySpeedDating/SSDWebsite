module "ec2-instance" {
  source                       = "terraform-aws-modules/ec2-instance/aws"
  name                         = "spidey-speed-dating-server-instance"
  key_name                     = "sean-ssd-web-levelup" # Has to be created manually on AWS as it's the easiest way to get the private key
  instance_type                = "t2.micro"
  ami_ssm_parameter            = "/aws/service/canonical/ubuntu/server/22.04/stable/current/amd64/hvm/ebs-gp2/ami-id"
  vpc_security_group_ids       = [module.vpc_sg.security_group_id]
  subnet_id                    = module.vpc.public_subnets[0]
  associate_public_ip_address  = true
}

module "ecr" {
  source = "terraform-aws-modules/ecr/aws"

  repository_name = "spidey-speed-dating-server-repo"

  repository_lifecycle_policy = jsonencode({
    rules = [{
      rulePriority = 10
      description  = "keep last 20 images"
      action = {
        type = "expire"
      }
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 20
      }
    },
    {
      rulePriority = 1
      description  = "Expire untagged images older than 14 days"
      action = {
        type = "expire"
      }
      selection = {
        tagStatus   = "untagged"
        countType   = "sinceImagePushed"
        countUnit   = "days"
        countNumber = 1
      }
    }]
  })
}

module "ecr" {
  source = "terraform-aws-modules/ecr/aws"

  repository_name = "spidey-speed-dating-api-repo"

  repository_lifecycle_policy = jsonencode({
    rules = [{
      rulePriority = 10
      description  = "keep last 20 images"
      action = {
        type = "expire"
      }
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 20
      }
    },
    {
      rulePriority = 1
      description  = "Expire untagged images older than 14 days"
      action = {
        type = "expire"
      }
      selection = {
        tagStatus   = "untagged"
        countType   = "sinceImagePushed"
        countUnit   = "days"
        countNumber = 1
      }
    }]
  })
}
