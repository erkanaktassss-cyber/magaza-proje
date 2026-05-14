from alembic import op
import sqlalchemy as sa

revision = '0001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('users', sa.Column('id', sa.Integer, primary_key=True), sa.Column('full_name', sa.String(120)), sa.Column('email', sa.String(120), unique=True), sa.Column('password_hash', sa.String(255)), sa.Column('role', sa.String(50)))
    op.create_table('production_lines', sa.Column('id', sa.Integer, primary_key=True), sa.Column('line_name', sa.String(100)), sa.Column('machine_name', sa.String(100)), sa.Column('status', sa.String(30)), sa.Column('instant_count', sa.Integer), sa.Column('target_count', sa.Integer), sa.Column('scrap_count', sa.Integer))
    op.create_table('production_orders', sa.Column('id', sa.Integer, primary_key=True), sa.Column('product_name', sa.String(120)), sa.Column('lot_number', sa.String(60)), sa.Column('kazan_number', sa.String(40)), sa.Column('target_quantity', sa.Integer), sa.Column('start_date', sa.Date), sa.Column('shift', sa.String(30)), sa.Column('operator_id', sa.Integer, sa.ForeignKey('users.id')))
    op.create_table('downtimes', sa.Column('id', sa.Integer, primary_key=True), sa.Column('line_id', sa.Integer, sa.ForeignKey('production_lines.id')), sa.Column('start_time', sa.DateTime), sa.Column('end_time', sa.DateTime), sa.Column('reason', sa.String(100)), sa.Column('description', sa.String(255)), sa.Column('department', sa.String(80)), sa.Column('total_minutes', sa.Integer))
    op.create_table('scrap_records', sa.Column('id', sa.Integer, primary_key=True), sa.Column('product_name', sa.String(120)), sa.Column('line_id', sa.Integer, sa.ForeignKey('production_lines.id')), sa.Column('reason', sa.String(120)), sa.Column('quantity', sa.Integer), sa.Column('description', sa.String(255)))
    op.create_table('oee_snapshots', sa.Column('id', sa.Integer, primary_key=True), sa.Column('line_id', sa.Integer, sa.ForeignKey('production_lines.id')), sa.Column('availability', sa.Float), sa.Column('performance', sa.Float), sa.Column('quality', sa.Float), sa.Column('oee', sa.Float), sa.Column('captured_at', sa.DateTime))

def downgrade():
    for t in ['oee_snapshots','scrap_records','downtimes','production_orders','production_lines','users']:
        op.drop_table(t)
